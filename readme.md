1. Installation npm packages: go to the backend directory and run
'npm i'. All dependencies from 'package.json' must downloaded and installed.
For DB use 'npm i pg'.
2. Server running by app.js with environments variables: NODE_ENV = development,
NODE_PATH = .
3. API requests:
    3.1 /api/questions (GET)
        Get all questions from DB, and rendering them.

    3.2 /api/question (POST)
        Add question in DB. Question send by request's body.

    3.3 /api/question/id (PUT or DELETE)
        Update or delete question from DB by id(from DB).

