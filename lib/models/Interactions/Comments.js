class Comment{
   constructor(data){
      this.id = data.id;
      this.content = data.content;
      this.created_at = data.created_at;
      this.user = {
         id: data.user_id,
         first_name: data.first_name,
         last_name: data.last_name,
      }
   }
}
export default Comment;