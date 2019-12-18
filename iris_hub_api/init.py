from flask import Flask
from flask_restful import Api
from flask_jwt_extended import JWTManager
from flask_cors import CORS

app = Flask(__name__)
app.config['MONGO_URI'] = "mongodb://mongo:27017"
app.config['PROPAGATE_EXCEPTIONS'] = True
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']
app.secret_key = 'replace me on production'

api = Api(app)
CORS(app)
jwt = JWTManager(app)


#@jwt.user_claims_loader
#def add_claims(identity):
#    service = UserService()
#    user = service.get_user_by_id(identity)
#    return {'is_admin': 'admin' in user['roles']}
