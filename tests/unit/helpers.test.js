// Unit tests for the front end helpers in public/js/helpers.js.
// These run in Node with no server or database.

const {
  MAX_FIELD_LENGTH,
  validateLogin,
  normalizeColorName,
  validateColorName,
  escapeHtml,
  formatColorList,
} = require("../../public/js/helpers.js");

describe("validateLogin", () => {
  test("accepts a username and password", () => {
    expect(validateLogin("RickL", "COP4331")).toBe("");
  });

  test("asks for both when both are empty", () => {
    expect(validateLogin("", "")).toBe("Please enter a username and password");
  });

  test("asks for a username when it's empty or only spaces", () => {
    expect(validateLogin("", "COP4331")).toBe("Please enter a username");
    expect(validateLogin("   ", "COP4331")).toBe("Please enter a username");
  });

  test("asks for a password when it's empty", () => {
    expect(validateLogin("RickL", "")).toBe("Please enter a password");
  });

  test("rejects fields longer than the database column", () => {
    const tooLong = "a".repeat(MAX_FIELD_LENGTH + 1);
    expect(validateLogin(tooLong, "COP4331")).toMatch(/at most 50 characters/);
    expect(validateLogin("RickL", tooLong)).toMatch(/at most 50 characters/);
  });

  test("allows fields exactly at the limit", () => {
    const atLimit = "a".repeat(MAX_FIELD_LENGTH);
    expect(validateLogin(atLimit, atLimit)).toBe("");
  });

  test("treats missing values as empty", () => {
    expect(validateLogin(undefined, null)).toBe("Please enter a username and password");
  });
});

describe("normalizeColorName", () => {
  test("trims spaces from both ends", () => {
    expect(normalizeColorName("  Blue  ")).toBe("Blue");
  });

  test("collapses repeated spaces and tabs inside the name", () => {
    expect(normalizeColorName("Light   Blue")).toBe("Light Blue");
    expect(normalizeColorName("Light\tSea  Green")).toBe("Light Sea Green");
  });

  test("leaves the capitalization alone", () => {
    expect(normalizeColorName("gray")).toBe("gray");
    expect(normalizeColorName("Chartreuse")).toBe("Chartreuse");
  });

  test("returns an empty string for anything that isn't a string", () => {
    expect(normalizeColorName(undefined)).toBe("");
    expect(normalizeColorName(42)).toBe("");
  });
});

describe("validateColorName", () => {
  test("accepts normal color names", () => {
    expect(validateColorName("Blue")).toBe("");
    expect(validateColorName("Light Blue")).toBe("");
    expect(validateColorName("Fuscia")).toBe("");
  });

  test("rejects an empty name", () => {
    expect(validateColorName("")).toBe("Please enter a color name");
  });

  test("rejects a name that is only spaces once it's normalized", () => {
    expect(validateColorName(normalizeColorName("    "))).toBe("Please enter a color name");
  });

  test("rejects names longer than Colors.Name allows", () => {
    expect(validateColorName("x".repeat(MAX_FIELD_LENGTH))).toBe("");
    expect(validateColorName("x".repeat(MAX_FIELD_LENGTH + 1))).toBe(
      "Color names can be at most 50 characters"
    );
  });

  test("rejects quotes and backslashes, which break the API's JSON", () => {
    expect(validateColorName('Sky "Blue"')).not.toBe("");
    expect(validateColorName("Back\\slash")).not.toBe("");
  });

  test("allows apostrophes and other punctuation", () => {
    expect(validateColorName("Robin's Egg Blue")).toBe("");
    expect(validateColorName("Blue-Green (dark)")).toBe("");
  });
});

describe("escapeHtml", () => {
  test("escapes characters that mean something in HTML", () => {
    expect(escapeHtml("<b>&\"'</b>")).toBe("&lt;b&gt;&amp;&quot;&#39;&lt;/b&gt;");
  });

  test("leaves plain text unchanged", () => {
    expect(escapeHtml("Light Blue")).toBe("Light Blue");
  });
});

describe("formatColorList", () => {
  test("puts each color on its own line", () => {
    expect(formatColorList(["Blue", "Light Blue"])).toBe("Blue<br />\r\nLight Blue");
  });

  test("returns a single color with no line break", () => {
    expect(formatColorList(["Cyan"])).toBe("Cyan");
  });

  test("returns an empty string for an empty list", () => {
    expect(formatColorList([])).toBe("");
  });

  test("returns an empty string when the API sends no results array", () => {
    // SearchColors.php sends {"error":"No Records Found"} with no results when nothing matches.
    const noMatch = JSON.parse('{"id":0,"firstName":"","lastName":"","error":"No Records Found"}');
    expect(formatColorList(noMatch.results)).toBe("");
  });

  test("escapes color names so they can't inject HTML", () => {
    expect(formatColorList(["<img src=x onerror=alert(1)>"])).toBe(
      "&lt;img src=x onerror=alert(1)&gt;"
    );
  });
});
