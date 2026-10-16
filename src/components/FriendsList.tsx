import { useState } from 'react';
import { UserPlus, Circle } from 'lucide-react';

interface Friend {
  id: string;
  name: string;
  isOnline: boolean;
}

export default function FriendsList() {
  const [friends, setFriends] = useState<Friend[]>([
    { id: '1', name: 'USA', isOnline: true },
    { id: '2', name: 'Japan', isOnline: false },
  ]);
  const [newFriendName, setNewFriendName] = useState('');

  const addFriend = () => {
    if (newFriendName) {
      setFriends([...friends, { id: Date.now().toString(), name: newFriendName, isOnline: true }]);
      setNewFriendName('');
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg text-white">
      <h3 className="text-xl font-bold mb-4">Friends List</h3>
      <div className="flex gap-2 mb-4">
        <input 
          value={newFriendName}
          onChange={(e) => setNewFriendName(e.target.value)}
          placeholder="Friend's Name"
          className="bg-gray-700 p-2 rounded flex-grow"
        />
        <button onClick={addFriend} className="bg-blue-600 p-2 rounded"><UserPlus size={20} /></button>
      </div>
      <ul>
        {friends.map(friend => (
          <li key={friend.id} className="flex justify-between items-center mb-2">
            <span>{friend.name}</span>
            <Circle size={12} className={`${friend.isOnline ? 'fill-green-500 text-green-500' : 'fill-gray-500 text-gray-500'}`} />
          </li>
        ))}
      </ul>
    </div>
  );
}
