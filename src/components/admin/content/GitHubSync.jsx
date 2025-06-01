import React, { useState, useEffect } from 'react';
import { Octokit } from 'octokit';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../ui/LoadingSpinner';

export default function GitHubSync({ page }) {
  const [settings, setSettings] = useState({
    token: '',
    repo: '',
    owner: '',
    branch: 'main',
    path: '',
    commitMessage: ''
  });
  const [syncing, setSyncing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [repos, setRepos] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(false);

  useEffect(() => {
    // Load GitHub settings from localStorage if available
    const savedSettings = localStorage.getItem('githubSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Failed to parse GitHub settings', e);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value
    });
  };

  const saveSettings = () => {
    localStorage.setItem('githubSettings', JSON.stringify(settings));
    setShowModal(false);
    toast.success('GitHub settings saved');
  };

  const fetchRepos = async () => {
    if (!settings.token) {
      toast.error('GitHub token is required');
      return;
    }
    
    try {
      setLoadingRepos(true);
      
      const octokit = new Octokit({ auth: settings.token });
      
      const { data } = await octokit.rest.repos.listForAuthenticatedUser({
        sort: 'updated',
        per_page: 100
      });
      
      setRepos(data.map(repo => ({
        name: repo.name,
        full_name: repo.full_name,
        owner: repo.owner.login
      })));
    } catch (error) {
      console.error('Error fetching repositories:', error);
      toast.error('Failed to fetch repositories');
    } finally {
      setLoadingRepos(false);
    }
  };

  const fetchBranches = async () => {
    if (!settings.token || !settings.owner || !settings.repo) {
      return;
    }
    
    try {
      setLoadingBranches(true);
      
      const octokit = new Octokit({ auth: settings.token });
      
      const { data } = await octokit.rest.repos.listBranches({
        owner: settings.owner,
        repo: settings.repo
      });
      
      setBranches(data.map(branch => branch.name));
    } catch (error) {
      console.error('Error fetching branches:', error);
      toast.error('Failed to fetch branches');
    } finally {
      setLoadingBranches(false);
    }
  };

  useEffect(() => {
    if (settings.token && settings.owner && settings.repo) {
      fetchBranches();
    }
  }, [settings.token, settings.owner, settings.repo]);

  const handleRepoSelect = (e) => {
    const [owner, repo] = e.target.value.split('/');
    setSettings({
      ...settings,
      owner,
      repo
    });
  };

  const syncWithGitHub = async () => {
    const { token, repo, owner, branch, path, commitMessage } = settings;
    
    if (!token || !repo || !owner) {
      toast.error('GitHub settings are incomplete');
      setShowModal(true);
      return;
    }
    
    try {
      setSyncing(true);
      
      const octokit = new Octokit({ auth: token });
      
      // Prepare file content
      const fileContent = JSON.stringify({
        title: page.title,
        slug: page.slug,
        meta_title: page.meta_title,
        meta_description: page.meta_description,
        content: page.content,
        sections: page.sections,
        updated_at: new Date().toISOString()
      }, null, 2);
      
      // Encode content to base64
      const contentEncoded = btoa(unescape(encodeURIComponent(fileContent)));
      
      // Determine file path
      const filePath = path || `content/${page.slug}.json`;
      
      // Check if file exists to determine if we need to create or update
      let sha;
      try {
        const { data: fileData } = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: filePath,
          ref: branch
        });
        
        sha = fileData.sha;
      } catch (error) {
        // File doesn't exist, will create new
        console.log('File does not exist, will create new');
      }
      
      // Create or update file
      const response = await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: filePath,
        message: commitMessage || `Update ${page.title} page`,
        content: contentEncoded,
        branch,
        sha
      });
      
      toast.success('Successfully synced with GitHub');
    } catch (error) {
      console.error('Error syncing with GitHub:', error);
      toast.error('Failed to sync with GitHub');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        GitHub Settings
      </button>
      
      <button
        type="button"
        onClick={syncWithGitHub}
        disabled={syncing}
        className="ml-3 inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
      >
        {syncing ? (
          <>
            <LoadingSpinner size="small" className="mr-2" />
            Syncing...
          </>
        ) : (
          'Sync with GitHub'
        )}
      </button>
      
      {/* Settings Modal */}
      {showModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    GitHub Sync Settings
                  </h3>
                  <div className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="token" className="block text-sm font-medium text-gray-700 text-left">
                          GitHub Personal Access Token
                        </label>
                        <input
                          type="password"
                          name="token"
                          id="token"
                          value={settings.token}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          placeholder="ghp_xxxxxxxxxxxx"
                        />
                        <p className="mt-1 text-xs text-gray-500 text-left">
                          Token needs repo scope permissions
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between">
                          <label htmlFor="repo" className="block text-sm font-medium text-gray-700 text-left">
                            Repository
                          </label>
                          <button
                            type="button"
                            onClick={fetchRepos}
                            disabled={loadingRepos || !settings.token}
                            className="text-xs text-primary-600 hover:text-primary-900"
                          >
                            {loadingRepos ? 'Loading...' : 'Fetch Repositories'}
                          </button>
                        </div>
                        
                        {repos.length > 0 ? (
                          <select
                            id="repo"
                            value={`${settings.owner}/${settings.repo}`}
                            onChange={handleRepoSelect}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          >
                            <option value="">Select a repository</option>
                            {repos.map(repo => (
                              <option key={repo.full_name} value={repo.full_name}>
                                {repo.full_name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="grid grid-cols-2 gap-4 mt-1">
                            <div>
                              <label htmlFor="owner" className="block text-xs font-medium text-gray-700 text-left">
                                Owner
                              </label>
                              <input
                                type="text"
                                name="owner"
                                id="owner"
                                value={settings.owner}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                placeholder="username or organization"
                              />
                            </div>
                            <div>
                              <label htmlFor="repo" className="block text-xs font-medium text-gray-700 text-left">
                                Repository
                              </label>
                              <input
                                type="text"
                                name="repo"
                                id="repo"
                                value={settings.repo}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                placeholder="repository-name"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="branch" className="block text-sm font-medium text-gray-700 text-left">
                          Branch
                        </label>
                        {branches.length > 0 ? (
                          <select
                            id="branch"
                            name="branch"
                            value={settings.branch}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          >
                            {branches.map(branch => (
                              <option key={branch} value={branch}>
                                {branch}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            name="branch"
                            id="branch"
                            value={settings.branch}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            placeholder="main"
                          />
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="path" className="block text-sm font-medium text-gray-700 text-left">
                          File Path (optional)
                        </label>
                        <input
                          type="text"
                          name="path"
                          id="path"
                          value={settings.path}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          placeholder={`content/${page?.slug || 'page'}.json`}
                        />
                        <p className="mt-1 text-xs text-gray-500 text-left">
                          Leave empty to use default: content/[page-slug].json
                        </p>
                      </div>
                      
                      <div>
                        <label htmlFor="commitMessage" className="block text-sm font-medium text-gray-700 text-left">
                          Commit Message
                        </label>
                        <input
                          type="text"
                          name="commitMessage"
                          id="commitMessage"
                          value={settings.commitMessage}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          placeholder={`Update ${page?.title || 'page'}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:col-start-2"
                  onClick={saveSettings}
                >
                  Save Settings
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
