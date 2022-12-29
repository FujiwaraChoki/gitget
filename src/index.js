const getRepositories = async (username) => {

    // Get the repository and add each one to an array
    let repos = [];

    await fetch(`https://api.github.com/users/${username}/repos`)
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                repos.push(data[i]);
            }
        }
        );

    console.table(repos);

    return repos;
};

const getHTMLAdvancedProfile = async (result) => {
     let whatToAppend = `
        <div class="card">
        <h4 style="text-align: center;"><b>${result.login}</b></h4>
            <div class="container">
                <img class="user-avatar" src="${result.avatar_url}" alt="Avatar">
    `;

    if (result.name !== null) {
        whatToAppend += `<h4><b>${result.name}</b></h4>`;
    } else {
        whatToAppend += `<h4><b>${result.login}</b></h4>`;
    }

    if (result.bio !== null) {
        whatToAppend += `<p>${result.bio}</p>`;
    }

    whatToAppend += `
            <p>
                <b>Followers: </b>${result.followers}<br />
                <b>Following: </b>${result.following}<br />
                <b>Public Repos: </b>${result.public_repos}<br />
                <b>Location: </b>${result.location}
            </p>
        </div>
    </div>
`;

    // This is the HTML for the repositories
    whatToAppend += `
        <div class="no-border-card" id="repos">
            <div class="container">
                <h4><b>Repositories</b></h4>
                <ul class="repo-list">
    `;

    let repos = await getRepositories(result.login);

    for (let i = 0; i < repos.length; i++) {
        whatToAppend += `
            <li class="repo-card">
                <a href="${repos[i].html_url}">${repos[i].name}</a>
                <p>${repos[i].description}</p>
                <p>
                    <b>Language(s): </b>${repos[i].language}<br />
                    <b>Stars: </b>${repos[i].stargazers_count}<br />
                    <b>Forks: </b>${repos[i].forks_count}
                </p>
            </li>
        `;
    }

    whatToAppend += `
                </ul>
            </div>
        </div>
    `;

    return whatToAppend;
};

const getUserInfo = async (username) => {
    const result = await fetch(`https://api.github.com/users/${username}`)
        .then(response => response.json())
        .then(data => data)
        .catch(err => console.log(err));

    const outputElement = document.getElementById('output');

    if (result.name !== undefined) {
        outputElement.innerHTML = await getHTMLAdvancedProfile(result);
    } else {
        outputElement.innerHTML = `
            <div class="card">
                <div class="container">
                    <h4><b>Not Found</b></h4> 
                </div>
            </div>
        `;
    }
}

const getInformationButton = document.getElementById('getInformationButton');
getInformationButton.addEventListener('click', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    getUserInfo(username);
});