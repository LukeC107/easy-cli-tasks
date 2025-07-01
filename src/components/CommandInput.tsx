
import React, { useState, useRef, useEffect } from 'react';
import { Task } from '@/types/task';
import { Terminal } from 'lucide-react';

interface CommandInputProps {
  onCommand: (command: string, args: string[]) => void;
  tasks: Task[];
}

const CommandInput: React.FC<CommandInputProps> = ({ onCommand, tasks }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = [
    'add',
    'update',
    'delete',
    'mark-in-progress',
    'mark-done',
    'list',
    'list-done',
    'list-todo',
    'list-in-progress'
  ];

  useEffect(() => {
    if (input.trim()) {
      const matches = commands.filter(cmd => 
        cmd.toLowerCase().includes(input.toLowerCase())
      );
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
      setSelectedSuggestion(0);
    } else {
      setShowSuggestions(false);
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const parts = input.trim().split(' ');
    const command = parts[0];
    const args = parts.slice(1);

    onCommand(command, args);
    setInput('');
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
      } else if (e.key === 'Tab' || e.key === 'Enter') {
        if (suggestions[selectedSuggestion]) {
          e.preventDefault();
          setInput(suggestions[selectedSuggestion] + ' ');
          setShowSuggestions(false);
          inputRef.current?.focus();
        }
      }
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setInput(suggestion + ' ');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-white border-2 border-gray-200 rounded-lg shadow-lg focus-within:border-blue-500 transition-colors">
          <Terminal className="w-5 h-5 text-gray-400 ml-4" />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter command... (e.g., 'add Buy groceries' or 'list-done')"
            className="flex-1 px-4 py-3 text-lg outline-none rounded-lg"
            autoComplete="off"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Execute
          </button>
        </div>
      </form>

      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              onClick={() => selectSuggestion(suggestion)}
              className={`w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                index === selectedSuggestion ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
            >
              <span className="font-mono text-blue-600">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommandInput;
