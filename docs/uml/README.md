# UML diagrams for COLORS

Three diagrams of the COLORS app, made with PlantUML. Each one has a `.puml` source file and a rendered `.png`.

| Diagram | Source | Image | What it shows |
|---|---|---|---|
| Use case | `usecase.puml` | `usecase.png` | The User and the four things they can do: Log In, Search Colors, Add Color, Log Out |
| Activity | `activity.puml` | `activity.png` | The full flow from login to logout, split into lanes for the user, the browser, the PHP API, and MySQL |
| Class | `class.puml` | `class.png` | The pages, code.js, the cookie, the PHP endpoints and their JSON bodies, config.php, and the database tables |

The app doesn't have any real classes (it's plain JavaScript and PHP scripts), so the class diagram models each file, JSON body, and table as a class with a stereotype like `<<PHP endpoint>>` or `<<table>>`.

The diagrams follow what the code actually does, including the rough edges listed in the main README. For example, a search with no matches throws a JS error and leaves the list alone, and Add Color shows "Color has been added" without checking the response.

## Re-rendering

With Java and Graphviz installed:

```
java -jar plantuml.jar -tpng docs/uml/*.puml
```
