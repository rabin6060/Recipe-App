import { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { Input } from '../ui/input';
import { IoSend } from "react-icons/io5";
import { create } from '@/api/comment';
import { toast } from 'sonner';
import axios from 'axios';
import { useNotification } from '@/Context/Notification';

interface EmojiInputProps {
  recipeId: string | undefined;
  setTrackComment: React.Dispatch<React.SetStateAction<boolean>>;
}

const EmojiInput: React.FC<EmojiInputProps> = ({recipeId,setTrackComment}) => {
  const [inputValue, setInputValue] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [_error,setError] = useState<Error | null>(null)
  const {socket} = useNotification()
  const formData = {...FormData,content:inputValue,type:"comment"}
  
  const handleEmojiClick = ( emojiObject:any) => {
    setInputValue(prevInput => prevInput + emojiObject.emoji);
    setShowPicker(false);
  };

  const handleComment =async () => {
    
    try {
      setTrackComment(false)
      setError(null)
      await create(recipeId,formData)
      setError(null)
      setInputValue('')
      setTrackComment(true)
      toast.success("comment added SuccessFull!!!")
      if (socket) {
        socket.emit("comment")
      }
      
    } catch (error:unknown) {
     if (axios.isAxiosError(error)) {
       if (error.response) {
        
        setError(error.response.data)
        toast.error(error.response.data.message)
      }
     }
    }
  }

  return (
    <div className='h-auto flex'>
        <div className='w-full flex items-center border rounded-lg'>
            <Input 
                    type="text" 
                    value={inputValue} 
                    onChange={e => setInputValue(e.target.value)} 
                    className='border-none'
                    placeholder='add a comment...'
                />
            <MdOutlineEmojiEmotions onClick={() => setShowPicker(val => !val)} fontSize={30} className='text-blue-500 cursor-pointer relative'/>
            <IoSend fontSize={30} className='text-blue-500 cursor-pointer mx-2' onClick={handleComment}/>
        </div>
        <div className='absolute bottom-20 right-0'>
            {showPicker && <EmojiPicker onEmojiClick={handleEmojiClick} />}
        </div>
     
      
    </div>
  );
};

export default EmojiInput;
