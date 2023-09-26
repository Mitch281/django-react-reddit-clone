from enum import Enum
from typing import TypedDict


class PostOrderingOptions(Enum):
    NO_ORDERING = ''
    NEW = 'new'
    OLD = 'old'
    TOP = 'top'
    BOTTOM = 'bottom'

class PostType(TypedDict):
    id: str
    username: str
    category_name: str
    num_comments: int
    title: str
    content: str
    num_upvotes: int
    num_downvotes: int
    date_created: str
    user: int
    category: str
