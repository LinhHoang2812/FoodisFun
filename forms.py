from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import DataRequired

class RegisterForm(FlaskForm):
    name = StringField("Your Name", validators=[DataRequired()])
    email = StringField("Your Email", validators=[DataRequired()])
    password = PasswordField("Your Password",validators=[DataRequired()])
    

class LoginForm(FlaskForm):
    email = StringField("Your Email", validators=[DataRequired()])
    password = PasswordField("Your Password", validators=[DataRequired()])
    