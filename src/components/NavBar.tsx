import { useState } from 'react';
import './NavBar.css';

interface NavBarProps {
  todoLists: { id: number; name: string }[];
  currentListId: number;
  onSelectList: (id: number) => void;
  onCreateList: (name: string) => void;
}

const NavBar = ({ todoLists, currentListId, onSelectList, onCreateList }: NavBarProps) => {
  const [newListName, setNewListName] = useState('');
  const [isCreatingList, setIsCreatingList] = useState(false);

  const handleCreateList = () => {
    if (newListName.trim()) {
      onCreateList(newListName.trim());
      setNewListName('');
      setIsCreatingList(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateList();
    }
  };

  return (
    <div className="sidebar-nav">
      <div className="nav-lists">
        {todoLists.map(list => (
          <button
            key={list.id}
            className={`nav-item ${list.id === currentListId ? 'active' : ''}`}
            onClick={() => onSelectList(list.id)}
          >
            {list.name}
          </button>
        ))}
      </div>
      
      <div className="nav-actions">
        {isCreatingList ? (
          <div className="create-list-form">
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="List name"
              autoFocus
              onKeyPress={handleKeyPress}
            />
            <div className="form-buttons">
              <button onClick={handleCreateList}>Create</button>
              <button onClick={() => setIsCreatingList(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <button className="new-list-btn" onClick={() => setIsCreatingList(true)}>
            + New List
          </button>
        )}
      </div>
    </div>
  );
};

export default NavBar; 