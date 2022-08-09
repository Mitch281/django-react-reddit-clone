
# Reddit Clone

This repository is a reddit clone written in 
django on the backend and react and redux 
toolkit on the frontend. The database is a postgresql 
database. The backend simply serves as a rest api to 
the frontend using the django rest framework. The 
styling of the application was completed mostly with 
css modules, although styled components were used 
with for loading indicators. JWT is used for user 
authentication.

## Technologies Used
### Backend
- Django
- Django Rest Framework
- PostgresSQL (with ORM)
- djangorestframework-simplejwt
### Frontend
- React
- Redux (Redux Toolkit)
- CSS Modules
### Features
- Ability to create, edit and delete posts/comments.
- Ability to create categories for posts.
- Nested comments of unlimited length.
- Ability to toggle the visiblity of comment replies.
- Ability to sort posts and comments by various metrics.
- Ability to sort posts by category.
- Ability to vote on comments and posts.
- Infinite scrolling when viewing posts.
### Desired Future Features
- Infinite Scrolling for Comments (harder to implement) due to nested nature of comments.
- Dark Mode
- Ability for users to save posts and comments as well as ability to view a user's posts and comments.
## Contributing
### Installation
First, clone the repository onto your local machine
like so:
```
git clone https://github.com/Mitch281/django-react-reddit-clone.git
```
Now navigate into the repository:
```
cd django-react-reddit-clone
```
### Backend Dependencies
Before starting, make sure you have pipenv installed.
This can be instaled from https://pypi.org/project/pipenv/.
After installing, start a virtual environment and run
it like so:
```
pipenv shell
pipenv install
```
Next, generate a random secret key;
```
cd backend
python manage.py shell
from django.core.management.utils import get_random_secret_key
get_random_secret_key()
```
Copy the secret key generated. Next create a .env file
in the backend directory (the one you are currently in).
```
mkdir .env
```
Then place the following line into the .env file:
```
SECRET_KEY = <SECRET_KEY_YOU_JUST_COPIED>
```

### Frontend Dependencies
First, navigate back to the root directory. Next, make
sure you have node installed. This can be installed from
https://nodejs.org/en/download/.
Now perform the below commands to install dependencies:
```
cd frontend
npm install
```
### Running the Program
Navigate back to the root directory, and perform
the following commands:
```
pipenv shell
cd backend
python manage.py runserver
cd ..
cd frontend
npm start
```
Or, you can open two seperate terminals and 
in the first terminal, perform:
```
pipenv shell
cd backend
python manage.py runserver
```
And in the second terminal:
```
cd frontend
npm start
```
