# Bashify

Bashify is a web-based terminal-like platform where users can create and define custom bash-style commands for their profiles. Each user gets a personalized terminal interface to execute commands. Bashify focuses on the simplicity and power of the command-line experience, allowing users to define commands with custom output for others to execute.

## Features
- **Custom Commands**: Users can create custom bash-like commands for their profiles.
- **Personalized URLs**: Each user gets a unique URL (e.g., `site/username`) to access their profile.
- **Terminal UI**: A sleek, terminal-inspired user interface, complete with dark mode .
- **Predefined Commands**: The `help` command is available to all users, showing available commands and their usage.



## Live Demo
Check out the live demo: [Bashify](https://farzam1389.pythonanywhere.com)  did not work now!!!

## Installation

To get started with Bashify locally, follow these steps:

### Prerequisites
- Python 3.7+
- Django 3.x+
- Git

### Clone the Repository

```bash
git clone https://github.com/your-username/bashify.git
cd bashify


python3 -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`


pip install -r req.txt


python manage.py migrate

python manage.py runserver
```
now you can access the site at localhost [here](http://localhost:8000)
Usage

    Sign Up/Login: Register and log in to create your Bashify profile.
    Define Commands: Once logged in, define custom commands for your profile.
    Execute Commands: Visit other users' profiles and try executing their custom commands.


the Version 1.1.0-beta new features:
    - add terminal to footer
    - add this commands:
        - ls
        - ls -a
        - clear
        - echo
        - date
        - help
        - pwd
        - whoami
        - exit
        - cd
    - you can use --help for all this commands


Example Commands

    help: Lists all available commands for the current user.
    Custom commands are defined by users in their profiles and can return any output they wish.

Deployment

To deploy Bashify on a live server, you can follow the typical Django deployment practices:

    Configure your server (Apache, Nginx, etc.)
    Set up a PostgreSQL/MySQL database
    Configure ALLOWED_HOSTS and set up environment variables for security.

Contributing

We welcome contributions! Please follow these steps to contribute:

    Fork the repository.
    Create a new branch (git checkout -b feature-branch).
    Make your changes.
    Commit your changes (git commit -m 'Add new feature').
    Push to the branch (git push origin feature-branch).
    Create a pull request.


Contact

For any questions or support, please feel free to reach out:

    Email: farzam.valizadeh.2020@gmail.com
    GitHub: [My Github](https://github.com/farzamvalizade)
