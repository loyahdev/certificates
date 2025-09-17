let githubToken = null;

const fetchGitHubToken = async () => {
    try {
        const response = await fetch('https://certapi.sideloading.org/pac');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        githubToken = await response.text();
        return githubToken;
    } catch (error) {
        console.error('Fetch error: ', error);
        githubToken = null;
        return null;
    }
};

const getRevokedFileListFromGitHub = async () => {
    console.log("Fetching revoked certs...");
    const apiUrl = 'https://api.github.com/repos/sideloadingdotorg/certificates/contents/certs/revoked';
    try {
        const token = await fetchGitHubToken();
        if (!token) return [];

        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        return data.map(file => ({
            name: file.name,
            download_url: file.download_url,
        }));
    } catch (error) {
        console.error('Error fetching revoked certs:', error);
        return [];
    }
};

const getSignedFileListFromGitHub = async () => {
    console.log("Fetching signed certs...");
    const apiUrl = 'https://api.github.com/repos/sideloadingdotorg/certificates/contents/certs/signed';
    try {
        const token = await fetchGitHubToken();
        if (!token) return [];

        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        return data.map(file => ({
            name: file.name,
            download_url: file.download_url,
        }));
    } catch (error) {
        console.error('Error fetching signed certs:', error);
        return [];
    }
};

const getAllCertFileListFromGitHub = async () => {
    try {
        const [revokedFiles, signedFiles] = await Promise.all([
            getRevokedFileListFromGitHub(),
            getSignedFileListFromGitHub()
        ]);
        return [...revokedFiles, ...signedFiles];
    } catch (error) {
        console.error('Error fetching all cert files:', error);
        return [];
    }
};

const getToken = async () => {
    return await fetchGitHubToken();
};

(async () => {
    console.log("Revoked Certs:", await getRevokedFileListFromGitHub());
    console.log("Signed Certs:", await getSignedFileListFromGitHub());
    console.log("All Certs:", await getAllCertFileListFromGitHub());
    //console.log("Token:", await getToken());
})();
