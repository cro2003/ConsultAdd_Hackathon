from config import Config

class RFPHelper():
    def allowed_file(self, filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in Config().ALLOWED_EXTENSIONS