from marshmallow import Schema, fields, validate
from .image import ImageSchema


class BaseCollectionSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1, max=120))
    images = fields.Nested(ImageSchema, many=True, exclude=("collection_id",))


class CollectionPostSchema(BaseCollectionSchema):
    pass


class CollectionGetSchema(BaseCollectionSchema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(dump_only=True)
