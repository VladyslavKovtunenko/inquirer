> 1. Installation npm packages:

    * Go to the backend directory.
    * Run 'npm i'. All dependencies from 'package.json' must be downloaded and installed.
    * For DB use 'npm i pg'.
> 2. Server running by app.js with environment variables:

    * NODE_ENV = development
    * NODE_PATH = . (curent directory)
> 3. API requests:

    * /api/questions (GET)
        Get all questions from DB, and rendering them.

    * /api/question (POST)
        Add question in DB. Question send by request's body.

    * /api/question/id (PUT or DELETE)
        Update or delete question from DB by id.

