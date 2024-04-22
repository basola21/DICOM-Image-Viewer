from marshmallow import Schema, fields, validate


class ImageSchema(Schema):
    id = fields.Int(dump_only=True)
    file_path = fields.Str(required=True, validate=validate.Length(min=1))
    collection_id = fields.Int(required=True)
