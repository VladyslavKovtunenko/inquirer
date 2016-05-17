>1. Installation npm packages:

    * Go to the backend directory.
    * Run 'npm i'.
    * All dependencies from 'package.json' must be downloaded and installed.
>2. DB usage

    * Create empty table before reestablishing.
    * DB dump in /backend/db/dump.
    * Run 'psql table_name < dump_name'.
>3. Server running by app.js with environment variables:

    * NODE_ENV = development
    * NODE_PATH = .
>4. API requests:

    * /api/questions (GET)
        Get all questions from DB, and rendering them.

    * /api/question (POST)
        Add question in DB. Question send by request's body.

    * /api/question/id (PUT or DELETE)
        Update or delete question from DB by id.

