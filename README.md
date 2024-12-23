# Bad Guy Barbers Client
Team Members: Tony Fernandez, David Jimenez, Samuel Laguna

Plz see the commit messages for what was done each time.

For the Complete Documentation for how to use the Endpoint see the link
https://docs.google.com/document/d/1Mnog1ixgAZhPT-cIAIN8BbeWeQYpBcP-X9HRWRWeaz8/edit?usp=sharing

------------------------------------------------------------------------------------------------------------------------------------
Part 3: Backend API Development with C# and EF Core (.NET 8)
Objective:
To create a RESTful API using C#, .NET 8, and Entity Framework Core that interacts with Azure SQL Server.

Instructions:
Setting Up the Project:

Use Visual Studio or VS Code to set up a new ASP.NET Core Web API project.
Use Entity Framework Core for database interaction.
Azure SQL Server: Set up an Azure SQL Database and connect your API to it. Ensure that your connection strings are securely managed.
API Endpoints:

Authentication: Implement JWT-based authentication to secure your API.
CRUD Endpoints: Implement the following endpoints for your main data model:
POST: Create a new entity (e.g., task, user, product).
GET: Retrieve a list of entities or a single entity by its ID.
PUT: Update an existing entity.
DELETE: Remove an entity by ID.
Validation: Ensure that all input data is validated using C#'s built-in validation annotations (e.g., [Required], [MaxLength]).
Entity Framework:

Create models and configure relationships (if necessary) using EF Core.
Run migrations to set up your database tables.
Use LINQ to query your database.
Deployment:

Deploy your backend to Azure App Service.
Connect your deployed API to your Azure SQL Database.
Submission:

Push your backend code to GitHub.
Submit the GitHub repository link and the deployed API URL.
Grading Criteria:
Correct API implementation (10%)
Proper use of EF Core with migrations (10%)
Authentication and security (10%)
Successful deployment on Azure (10%)
Final Submission Checklist:
Flowchart (PDF) and Figma link.
GitHub link for the frontend and backend.
Live demo of the frontend.
Deployed API link.
