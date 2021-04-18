const colorPicker = {
    COLORS: ['#ED6A5A', '#c4c25e', '#bd7945', '#E0AFA0', '#5F464B', '#9BC1BC'],
    currentColor: 0,
    next: function() {
        this.currentColor = this.currentColor < this.COLORS.length - 1 ? ++this.currentColor : 0;
        return this.COLORS[this.currentColor];
    }
}

function makePR(isOpened, title, author, labels, photoPath) {
    return {
        isOpened: isOpened,
        title: title,
        author: author,
        labels: labels,
        photoPath: photoPath
    }
}

function fetchPRs() {
    return [
        makePR(true, "Namawiamy dostawców", "Hipster Coffee", ['Food', 'Culture'], 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2FmZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80'),
        makePR(false, "Ogarniamy działeczkę", "JanuszPOL", ['Food'], 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2FmZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80'),
        makePR(false, "Ogarniamy działeczkę", "JanuszPOL", ['Food'], 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2FmZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80'),
        makePR(false, "Ogarniamy działeczkę", "JanuszPOL", ['Food'], 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2FmZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80'),
        makePR(false, "Ogarniamy działeczkę", "JanuszPOL", ['Food'], 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2FmZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80'), makePR(false, "Ogarniamy działeczkę", "JanuszPOL", ['Food'], 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2FmZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80'), makePR(false, "Ogarniamy działeczkę", "JanuszPOL", ['Food'], 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2FmZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80'),
        makePR(false, "Ogarniamy działeczkę", "JanuszPOL", ['Food'], 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2FmZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80'),
        makePR(false, "Ogarniamy działeczkę", "JanuszPOL", ['Food'], 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2FmZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80'),
        makePR(false, "Ogarniamy działeczkę", "JanuszPOL", ['Food'], 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2FmZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80'),
        makePR(false, "Ogarniamy działeczkę", "JanuszPOL", ['Food'], 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2FmZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80'),
    ]
}

function preparePR_HTML(PR) {
    const createWrapper = (elements, className) => {
        const wrapper = document.createElement('div');
        for (const elem of elements) {
            wrapper.append(elem);
        }
        wrapper.classList.add(className);
        return wrapper;
    }

    const prElem = document.createElement('div');
    prElem.classList.add('list-item');

    let rightElements = [];
    let leftElements = [];

    const openedIcon = document.createElement('img');
    openedIcon.src = PR.isOpened ? 'img/icons/pr_open_dark.png' : 'img/icons/pr_closed.png';
    leftElements.push(openedIcon);

    const title = document.createElement('span');
    title.innerText = PR.title;
    leftElements.push(title);

    const author = document.createElement('span');
    author.innerText = PR.author;
    rightElements.push(author);

    const labelsDiv = document.createElement('div');
    labelsDiv.classList.add('labels');
    for (const lab of PR.labels) {
        const labelHTML = document.createElement('span');
        labelHTML.innerText = lab;
        labelHTML.style.background = colorPicker.next();
        labelsDiv.append(labelHTML);
    }
    rightElements.push(labelsDiv);

    const img = document.createElement('img');
    img.src = PR.photoPath;
    rightElements.push(img);

    const rightDiv = createWrapper(rightElements, 'right-inner-items');
    const leftDiv = createWrapper(leftElements, 'left-inner-items');

    prElem.append(leftDiv);
    prElem.append(rightDiv);
    return prElem;
}

function removeDescription(listwrapper, prElem) {
    listwrapper.removeChild(prElem.nextSibling);
}

function addDescription(listwrapper, test) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('pr-description-wrapper');

    const left = document.createElement('div');
    left.classList.add('pr-description-left');
    const right = document.createElement('div');
    right.classList.add('pr-description-right');
    const text = document.createElement('p');
    text.innerText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit" +
        "Lorem ipsum dolor sit amet, consectetur";
    const goToPR = document.createElement('a');
    goToPR.innerText = 'Go to this pull request';
    const img = document.createElement('img');
    img.src = '/img/icons/go-arrow.svg';
    goToPR.append(img);
    right.append(goToPR);
    left.append(text);
    wrapper.append(left);
    wrapper.append(right);
    listwrapper.insertBefore(wrapper, test.nextSibling);
}

function addPRsToList(PRs) {
    const container = document.getElementById('pr_info_blocks_area');
    const fragment = document.createDocumentFragment();
    const open_counter = document.getElementById('open_count');
    const closed_counter = document.getElementById('closed_count');
    var open = 0,
        closed = 0;
    for (const PR of PRs)
        if (PR.isOpened) open++;
        else closed++;
    open_counter.innerText = open;
    closed_counter.innerText = closed;

    for (const PR of PRs) {
        const prElem = preparePR_HTML(PR);
        prElem.onclick = function() {
            $(prElem).toggleClass('pr-content');
            if ($(prElem).hasClass('pr-content')) {
                addDescription(container, prElem);
            } else {
                removeDescription(container, prElem);
            }
        }
        fragment.append(prElem);
    }
    container.append(fragment);
}

addPRsToList(fetchPRs());