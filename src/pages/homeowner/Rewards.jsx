import React, { useState, useEffect } from 'react';
import { StarIcon, GiftIcon, TrophyIcon, ArrowPathIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useApp } from '../../contexts/AppContext';
import { useHomeowner } from '../../contexts/HomeownerContext';
import Header from '../../components/layout/Header';

const Rewards = () => {
  const { userProfile } = useApp();
  const { homeownerProfile } = useHomeowner();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Use homeowner profile if available, otherwise use the active profile from AppContext
  const profile = homeownerProfile || userProfile;
  
  // Mock data for rewards
  const rewardsPoints = profile?.rewards_points || 750;
  const rewardsLevel = getRewardsLevel(rewardsPoints);
  
  const recentActivity = [
    { id: 1, type: 'earned', points: 150, description: 'Completed bathroom renovation project', date: '2023-10-15' },
    { id: 2, type: 'earned', points: 50, description: 'Left review for Plumbing Experts', date: '2023-10-10' },
    { id: 3, type: 'redeemed', points: 200, description: 'Discount on painting service', date: '2023-09-28' },
    { id: 4, type: 'earned', points: 100, description: 'Referred a friend', date: '2023-09-20' },
    { id: 5, type: 'earned', points: 75, description: 'Participated in Fall Home Challenge', date: '2023-09-15' },
  ];
  
  const availableRewards = [
    { id: 1, title: '10% off next service', points: 200, category: 'discount', description: 'Get 10% off your next service booking through Home Swerv' },
    { id: 2, title: 'Priority scheduling', points: 300, category: 'service', description: 'Get priority scheduling with participating service providers' },
    { id: 3, title: '$50 service credit', points: 500, category: 'credit', description: '$50 credit toward any service booked through Home Swerv' },
    { id: 4, title: 'Free home consultation', points: 750, category: 'service', description: 'One-hour consultation with a home improvement expert' },
    { id: 5, title: 'Premium tool rental', points: 1000, category: 'product', description: 'Free weekend rental of premium tools from partner stores' },
  ];
  
  const activeChallenges = [
    { 
      id: 1, 
      title: 'Fall Home Maintenance', 
      description: 'Complete 3 fall maintenance tasks and earn bonus points', 
      reward: 200, 
      deadline: '2023-11-30',
      progress: 1,
      total: 3
    },
    { 
      id: 2, 
      title: 'Energy Efficiency Challenge', 
      description: 'Implement energy-saving improvements to earn rewards', 
      reward: 300, 
      deadline: '2023-12-15',
      progress: 0,
      total: 4
    },
    { 
      id: 3, 
      title: 'Neighborhood Beautification', 
      description: 'Join your neighbors in community improvement projects', 
      reward: 250, 
      deadline: '2023-11-15',
      progress: 2,
      total: 5
    },
  ];
  
  function getRewardsLevel(points) {
    if (points >= 2000) return { name: 'Platinum', color: 'bg-purple-100 text-purple-800', nextLevel: null, progress: 100 };
    if (points >= 1000) return { name: 'Gold', color: 'bg-yellow-100 text-yellow-800', nextLevel: 'Platinum', progress: (points - 1000) / 10 };
    if (points >= 500) return { name: 'Silver', color: 'bg-gray-100 text-gray-800', nextLevel: 'Gold', progress: (points - 500) / 5 };
    return { name: 'Bronze', color: 'bg-orange-100 text-orange-800', nextLevel: 'Silver', progress: points / 5 };
  }

  return (
    <div>
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="py-6">
          <h1 className="text-2xl font-semibold text-gray-900">Community Rewards</h1>
          <p className="mt-1 text-sm text-gray-500">
            Earn points for completing projects, leaving reviews, and participating in community challenges.
          </p>
        </div>
        
        {/* Rewards Summary Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <StarIcon className="h-10 w-10 text-blue-600" aria-hidden="true" />
                  </div>
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {rewardsPoints} Swerv Points
                  </h2>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${rewardsLevel.color}`}>
                    {rewardsLevel.name} Level
                  </span>
                </div>
              </div>
              
              {rewardsLevel.nextLevel && (
                <div className="mt-4 md:mt-0">
                  <p className="text-sm text-gray-500">
                    {rewardsLevel.nextLevel ? `${rewardsLevel.nextLevel} Level Progress` : 'Maximum Level Achieved'}
                  </p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${rewardsLevel.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Rewards Navigation */}
          <div className="border-t border-gray-200">
            <div className="flex -mb-px">
              <button
                className={`flex-1 py-4 px-1 text-center border-b-2 text-sm font-medium ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`flex-1 py-4 px-1 text-center border-b-2 text-sm font-medium ${
                  activeTab === 'redeem'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('redeem')}
              >
                Redeem Rewards
              </button>
              <button
                className={`flex-1 py-4 px-1 text-center border-b-2 text-sm font-medium ${
                  activeTab === 'challenges'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('challenges')}
              >
                Challenges
              </button>
              <button
                className={`flex-1 py-4 px-1 text-center border-b-2 text-sm font-medium ${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('history')}
              >
                Activity History
              </button>
            </div>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="mt-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900">Ways to Earn Swerv Points</h3>
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-lg font-medium text-gray-900">Complete Projects</h4>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        Earn 100-500 points for each project completed through Home Swerv, depending on project size.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <StarIcon className="h-6 w-6 text-yellow-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-lg font-medium text-gray-900">Leave Reviews</h4>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        Earn 50 points for each detailed review you leave for service providers you've worked with.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <TrophyIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-lg font-medium text-gray-900">Challenges</h4>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        Participate in seasonal and community challenges to earn bonus points and special rewards.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-lg font-medium text-gray-900">Refer Friends</h4>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        Earn 100 points for each friend you refer who signs up and completes their first project.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-lg font-medium text-gray-900">Milestone Achievements</h4>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        Earn bonus points for reaching project milestones and completing seasonal home maintenance.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-lg font-medium text-gray-900">Community Participation</h4>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        Participate in neighborhood improvement initiatives and earn points for community contributions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
                <div className="mt-2 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Activity</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Points</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {recentActivity.slice(0, 3).map((activity) => (
                        <tr key={activity.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {activity.description}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`inline-flex items-center ${activity.type === 'earned' ? 'text-green-600' : 'text-red-600'}`}>
                              {activity.type === 'earned' ? '+' : '-'}{activity.points}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {new Date(activity.date).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-right">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => setActiveTab('history')}
                  >
                    View all activity
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Redeem Rewards Tab */}
          {activeTab === 'redeem' && (
            <div>
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <GiftIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Available to Redeem</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>You have <span className="font-semibold">{rewardsPoints} Swerv Points</span> available to redeem for rewards.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {availableRewards.map((reward) => (
                  <div key={reward.id} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-medium text-gray-900">{reward.title}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {reward.points} points
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">{reward.description}</p>
                      <div className="mt-4">
                        <button
                          type="button"
                          className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white ${
                            rewardsPoints >= reward.points
                              ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                              : 'bg-gray-300 cursor-not-allowed'
                          }`}
                          disabled={rewardsPoints < reward.points}
                        >
                          {rewardsPoints >= reward.points ? 'Redeem Reward' : 'Not Enough Points'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Challenges Tab */}
          {activeTab === 'challenges' && (
            <div>
              <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Active Challenges</h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>Complete these challenges to earn bonus Swerv Points and special rewards.</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {activeChallenges.map((challenge) => (
                  <div key={challenge.id} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">{challenge.title}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          +{challenge.reward} points
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">{challenge.description}</p>
                      
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Progress: {challenge.progress} of {challenge.total}</span>
                          <span className="text-gray-500">
                            <ClockIcon className="inline-block h-4 w-4 mr-1" />
                            Ends: {new Date(challenge.deadline).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <button
                          type="button"
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Activity History Tab */}
          {activeTab === 'history' && (
            <div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Points Activity History</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    A record of all your Swerv Points earned and redeemed.
                  </p>
                </div>
                <div className="border-t border-gray-200">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Activity
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Points
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentActivity.map((activity) => (
                          <tr key={activity.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {activity.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`inline-flex items-center ${activity.type === 'earned' ? 'text-green-600' : 'text-red-600'}`}>
                                {activity.type === 'earned' ? '+' : '-'}{activity.points}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(activity.date).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rewards;
