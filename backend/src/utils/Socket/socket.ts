// io.on('connection', socket => {
//     console.log('a user connected');
//     socket.on('register',(userId)=>{
//       users[userId] = socket.id
//     })
//     socket.on('follow', async(follow) => {
//       console.log('start to follow you', follow);
//       io.emit('notification', follow);
//     });
//     socket.on('disconnect', () => {
//       for (const [userId, socketId] of Object.entries(users)) {
//       if (socketId === socket.id) {
//         delete users[userId];
//         break;
//       }
//     }
//     });
//   });