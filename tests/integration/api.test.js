// Integration tests for the PHP API in api/.
//
// These send real HTTP requests to Login.php, SearchColors.php, and AddColor.php
// and check the JSON that comes back. They need the API running with a MySQL
// database loaded from database/schema.sql. In GitHub Actions the workflow sets
// that up with PHP's built-in web server and a MySQL container. Node only runs
// the tests; PHP serves the API.
//
// API_URL is the folder the endpoints are served from, for example
// http://127.0.0.1:8000 (CI) or http://<server>/LAMPAPI.

const API_URL = (process.env.API_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

// Sample data from database/schema.sql.
const RICK = { login: "RickL", password: "COP4331", id: 1, firstName: "Rick", lastName: "Leinecker" };
const SAM_ID = 2; // SamH has no colors in the sample data.

async function post(endpoint, body) {
  let response;
  try {
    response = await fetch(`${API_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    throw new Error(`Could not reach ${API_URL}/${endpoint}. Is the API running? (${err.message})`, {
      cause: err,
    });
  }

  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`${endpoint} did not return valid JSON. Body was:\n${text}`);
  }
  return { status: response.status, contentType: response.headers.get("content-type"), json };
}

describe("Login.php", () => {
  test("returns the user's id and name for a correct login", async () => {
    const { status, contentType, json } = await post("Login.php", {
      login: RICK.login,
      password: RICK.password,
    });

    expect(status).toBe(200);
    expect(contentType).toMatch(/application\/json/);
    expect(json).toEqual({
      id: RICK.id,
      firstName: RICK.firstName,
      lastName: RICK.lastName,
      error: "",
    });
  });

  test("returns id 0 and an error for a wrong password", async () => {
    const { status, json } = await post("Login.php", { login: RICK.login, password: "wrong" });

    expect(status).toBe(200);
    expect(json).toEqual({ id: 0, firstName: "", lastName: "", error: "No Records Found" });
  });

  test("returns id 0 for a user that doesn't exist", async () => {
    const { json } = await post("Login.php", { login: "NoSuchUser", password: "x" });

    expect(json.id).toBe(0);
    expect(json.error).toBe("No Records Found");
  });
});

describe("SearchColors.php", () => {
  test("returns a results array of matching color names", async () => {
    const { status, contentType, json } = await post("SearchColors.php", {
      search: "Blue",
      userId: RICK.id,
    });

    expect(status).toBe(200);
    expect(contentType).toMatch(/application\/json/);
    expect(Object.keys(json).sort()).toEqual(["error", "results"]);
    expect(json.error).toBe("");
    expect(Array.isArray(json.results)).toBe(true);
    expect(json.results).toEqual(expect.arrayContaining(["Blue", "Light Blue"]));
    for (const name of json.results) {
      expect(typeof name).toBe("string");
      expect(name.toLowerCase()).toContain("blue");
    }
  });

  test("an empty search returns all of the user's colors", async () => {
    const { json } = await post("SearchColors.php", { search: "", userId: RICK.id });

    // schema.sql inserts 18 colors for user 1.
    expect(json.results).toHaveLength(18);
  });

  test("only searches the given user's colors", async () => {
    const { json } = await post("SearchColors.php", { search: "Blue", userId: SAM_ID });

    expect(json.results).toBeUndefined();
    expect(json.error).toBe("No Records Found");
  });

  test("returns an error and no results when nothing matches", async () => {
    const { status, json } = await post("SearchColors.php", {
      search: "NotARealColorName",
      userId: RICK.id,
    });

    expect(status).toBe(200);
    expect(json.results).toBeUndefined();
    expect(json.error).toBe("No Records Found");
  });
});

describe("AddColor.php", () => {
  test("adds a color that SearchColors can then find", async () => {
    const newColor = `Test Teal ${Date.now()}`;

    const added = await post("AddColor.php", { color: newColor, userId: SAM_ID });
    expect(added.status).toBe(200);
    expect(added.contentType).toMatch(/application\/json/);
    expect(added.json).toEqual({ error: "" });

    const found = await post("SearchColors.php", { search: newColor, userId: SAM_ID });
    expect(found.json.error).toBe("");
    expect(found.json.results).toEqual([newColor]);
  });
});
