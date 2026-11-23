/* exported validateLogin, normalizeColorName, validateColorName, formatColorList */
// Input checks and formatting used by code.js. Nothing in here touches the page
// or the network, so the Jest unit tests in tests/unit can load this file directly.

// Login, Password, and Colors.Name are all VARCHAR(50) in database/schema.sql.
const MAX_FIELD_LENGTH = 50;

// Returns an error message for the login form, or "" if it's OK to send.
function validateLogin(login, password)
{
	const name = (typeof login === "string") ? login.trim() : "";
	const pass = (typeof password === "string") ? password : "";

	if( name === "" && pass === "" )
	{
		return "Please enter a username and password";
	}
	if( name === "" )
	{
		return "Please enter a username";
	}
	if( pass === "" )
	{
		return "Please enter a password";
	}
	if( name.length > MAX_FIELD_LENGTH || pass.length > MAX_FIELD_LENGTH )
	{
		return "Username and password can be at most " + MAX_FIELD_LENGTH + " characters";
	}
	return "";
}

// Trims a color name and collapses runs of spaces, so "  Light   Blue " is saved as "Light Blue".
function normalizeColorName(name)
{
	if( typeof name !== "string" )
	{
		return "";
	}
	return name.trim().replace(/\s+/g, " ");
}

// Returns an error message for a color name, or "" if it can be added.
// Call it on the normalized name.
function validateColorName(name)
{
	if( typeof name !== "string" || name === "" )
	{
		return "Please enter a color name";
	}
	if( name.length > MAX_FIELD_LENGTH )
	{
		return "Color names can be at most " + MAX_FIELD_LENGTH + " characters";
	}
	// The PHP builds its JSON by joining strings, so a " or \ in a name breaks the search response.
	if( /["\\]/.test(name) )
	{
		return "Color names can't contain \" or \\";
	}
	return "";
}

function escapeHtml(text)
{
	return String(text)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

// Turns the results array from SearchColors.php into the HTML for the color list.
// Names are escaped because they're shown with innerHTML. When the search finds
// nothing the API sends no results array, so anything that isn't an array gives "".
function formatColorList(results)
{
	if( !Array.isArray(results) )
	{
		return "";
	}
	return results.map(escapeHtml).join("<br />\r\n");
}

// Lets Jest require() this file. Browsers skip this because module doesn't exist there.
if( typeof module !== "undefined" && module.exports )
{
	module.exports = { MAX_FIELD_LENGTH, validateLogin, normalizeColorName, validateColorName, escapeHtml, formatColorList };
}
