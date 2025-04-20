class Post {
  constructor(data) {
    this.id = data.id;
    this.content = data.content;
    this.category = data.category;
    this.created_at = data.created_at;
    this.user_id = data.user_id;
    this.user_first_name = data.first_name;
    this.user_last_name = data.last_name;
    this.major = data.major;
    this.likes = data.likes || [];
    this.comments = data.comments || [];
    this.dislikesCount = data.dislikesCount || 0;
    this.currentUserReaction = data.currentUserReaction;
  }

}

export default Post;
