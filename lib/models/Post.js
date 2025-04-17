class Post {
  constructor(data) {
    this.id = data.id;
    this.major = data.major;
    this.user_first_name = data.first_name;
    this.user_last_name = data.last_name;
    this.content = data.content;
    this.likesCount = data.likesCount || 0;
    this.dislikesCount = data.dislikesCount || 0;
    this.commentsCount = data.commentsCount || 0;
    this.currentUserReaction = data.currentUserReaction || null;
    this.category = data.category;
    this.created_at = data.created_at;
  }

}

export default Post;
