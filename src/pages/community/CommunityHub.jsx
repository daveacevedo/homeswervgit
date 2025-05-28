import React from 'react';
import { Navigate } from 'react-router-dom';
import CommunityHubComponent from '../../components/homeowner/community/CommunityHub';

// This is a wrapper component that redirects to the actual CommunityHub component
const CommunityHub = () => {
  return <CommunityHubComponent />;
};

export default CommunityHub;
