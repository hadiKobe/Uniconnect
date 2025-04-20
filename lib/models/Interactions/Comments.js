class Comment{
   constructor(data){
      this.id = data.id;
      this.content = data.content;
      this.created_at = data.created_at;
      this.user = {
         id: data.user.id,
         first_name: data.user.first_name,
         last_name: data.user.last_name,
      }
   }
}
export default Comment;