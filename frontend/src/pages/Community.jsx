import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import GroupList from '../components/community/GroupList';
import ChatRoom from '../components/community/ChatRoom';
import QuestionCard from '../components/community/QuestionCard';
import Card from '../components/common/Card';
import { Plus, MessageSquare, HelpCircle } from 'lucide-react';
import { communityAPI } from '../services/api';
import toast from 'react-hot-toast';

const Community = () => {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'qa'
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreateQuestion, setShowCreateQuestion] = useState(false);
  const [groupForm, setGroupForm] = useState({ name: '', description: '', isPrivate: false });
  const [questionForm, setQuestionForm] = useState({ title: '', content: '', tags: '' });

  useEffect(() => {
    fetchGroups();
    fetchQuestions();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await communityAPI.getGroups();
      setGroups(response.data.data);
    } catch (error) {
      toast.error('Failed to load groups');
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await communityAPI.getQuestions();
      setQuestions(response.data.data);
    } catch (error) {
      toast.error('Failed to load questions');
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await communityAPI.createGroup(groupForm);
      toast.success('Group created!');
      setShowCreateGroup(false);
      setGroupForm({ name: '', description: '', isPrivate: false });
      fetchGroups();
    } catch (error) {
      toast.error('Failed to create group');
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await communityAPI.joinGroup(groupId);
      toast.success('Joined group!');
      fetchGroups();
    } catch (error) {
      toast.error('Failed to join group');
    }
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...questionForm,
        tags: questionForm.tags.split(',').map(t => t.trim()).filter(t => t)
      };
      await communityAPI.createQuestion(data);
      toast.success('Question posted!');
      setShowCreateQuestion(false);
      setQuestionForm({ title: '', content: '', tags: '' });
      fetchQuestions();
    } catch (error) {
      toast.error('Failed to post question');
    }
  };

  const handleAddAnswer = async (questionId, content) => {
    try {
      await communityAPI.addAnswer(questionId, { content });
      toast.success('Answer added!');
      fetchQuestions();
    } catch (error) {
      toast.error('Failed to add answer');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Navbar title="Farmer Community" />
        <div className="p-8 mt-16">
          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'chat'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span>Group Chat</span>
              </button>
              <button
                onClick={() => setActiveTab('qa')}
                className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'qa'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <HelpCircle className="w-5 h-5" />
                <span>Q&A Forum</span>
              </button>
            </div>
          </div>

          {/* Content */}
          {activeTab === 'chat' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Groups List */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Groups</h3>
                  <button
                    onClick={() => setShowCreateGroup(!showCreateGroup)}
                    className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {showCreateGroup && (
                  <Card className="mb-4">
                    <form onSubmit={handleCreateGroup} className="space-y-3">
                      <input
                        type="text"
                        placeholder="Group name"
                        value={groupForm.name}
                        onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                      />
                      <textarea
                        placeholder="Description"
                        value={groupForm.description}
                        onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                        rows={2}
                      />
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={groupForm.isPrivate}
                          onChange={(e) => setGroupForm({ ...groupForm, isPrivate: e.target.checked })}
                        />
                        <span className="text-sm">Private Group</span>
                      </label>
                      <button
                        type="submit"
                        className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
                      >
                        Create Group
                      </button>
                    </form>
                  </Card>
                )}

                <GroupList
                  groups={groups}
                  selectedGroup={selectedGroup}
                  onGroupSelect={setSelectedGroup}
                  onJoinGroup={handleJoinGroup}
                />
              </div>

              {/* Chat Room */}
              <div className="lg:col-span-2">
                <ChatRoom group={selectedGroup} />
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Questions</h3>
                <button
                  onClick={() => setShowCreateQuestion(!showCreateQuestion)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  <Plus className="w-5 h-5" />
                  <span>Ask Question</span>
                </button>
              </div>

              {showCreateQuestion && (
                <Card className="mb-6">
                  <form onSubmit={handleCreateQuestion} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Question title"
                      value={questionForm.title}
                      onChange={(e) => setQuestionForm({ ...questionForm, title: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                    <textarea
                      placeholder="Question details"
                      value={questionForm.content}
                      onChange={(e) => setQuestionForm({ ...questionForm, content: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      rows={4}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Tags (comma-separated)"
                      value={questionForm.tags}
                      onChange={(e) => setQuestionForm({ ...questionForm, tags: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                      >
                        Post Question
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCreateQuestion(false)}
                        className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </Card>
              )}

              <div className="space-y-6">
                {questions.map((question) => (
                  <QuestionCard
                    key={question._id}
                    question={question}
                    onAddAnswer={handleAddAnswer}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;
