dbImage = {
  path: "",
  description: "",
}

const colorPicker = {
  COLORS: ['#ED6A5A', '#c4c25e', '#bd7945', '#E0AFA0', '#5F464B', '#9BC1BC'],
  currentColor: 0,
  next: function() {
    this.currentColor = this.currentColor < this.COLORS.length - 1 ? ++this.currentColor : 0;
    return this.COLORS[this.currentColor];
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// TODO: get images from fb
function fetchImages(num_images) {
  const path = "https://hypebeast.com/wp-content/blogs.dir/6/files/2019/08/best-new-york-city-hotels-celebrity-sightings-kim-kardashian-meghan-markle-bella-hadid-1.jpg";
  let dbImages = new Array(num_images);
  dbImages.fill(dbImage)
  for (const _dbImage of dbImages) {
    _dbImage.description = "Lorem Ipsum ashduagsdu agsudgua agsudg";
    _dbImage.path = path;
  }
  return dbImages;
}

function insertImages(numImages) {
  const container = document.getElementById('main-gallery');
  const fragment = document.createDocumentFragment()

  for (const _dbImage of fetchImages(numImages)) {
    const item = document.createElement('div');
    item.classList.add('gallery-item')
    const img = document.createElement('img');
    img.src = _dbImage.path;
    const title = document.createElement('h3');
    title.innerText = _dbImage.description;

    item.append(img);
    item.append(title);
    fragment.append(item);
  }
  container.append(fragment);
}

function fetchCityDistricts() {
  return ["Śródmieście", "Stare Bałuty", "Górna", "Widzew", "Polesie", "Pabianice", "Rydzynki"];
}

function fetchCategories() {
  return ['food', 'QA', 'restaurant', 'restructurings', 'culture', 'wellness'];
}


function insertGalleryFilters() {
  const container = document.getElementById('district-filters-wrapper');
  const fragment = document.createDocumentFragment();

  for (const district of fetchCityDistricts()) {
    const spanFilter = document.createElement('span');
    spanFilter.innerText = district;
    spanFilter.classList.add('gallery-filter-item');
    fragment.append(spanFilter);
  }
  container.append(fragment)

  const districtHeader = document.getElementById('district-header');
  districtHeader.onclick = async () => {
    const arrow = document.getElementById('district-arrow');
    const filtersList = document.getElementById('district-filters-wrapper');
    $(arrow).toggleClass('unwrapped-arrow');
    $(filtersList).toggleClass('unwrapped-list');

    if ($(filtersList).hasClass('unwrapped-list')) {
      for await (let span of $(filtersList).find('span')) {
        $(span).animate({
          opacity: 1,
        }, 500);
        await sleep(80);
      }
    } else {
        $(filtersList).find('span').css({
          opacity: 0
        });
    }
  }
}

function insertCategories() {
  const container = document.getElementById('category-filters-wrapper');
  const fragment = document.createDocumentFragment();

  for (const category of fetchCategories()) {
    const spanFilter = document.createElement('span');
    spanFilter.innerText = category;
    spanFilter.classList.add('category-filter-item');
    spanFilter.style.background = colorPicker.next();
    fragment.append(spanFilter);
  }
  container.append(fragment)
}

insertGalleryFilters();
insertCategories();
insertImages(20);

$('.gallery-filter-item').on('click', function() {
  $(this).toggleClass('selected');
  if ($(this).hasClass('selected')) {
    $('.gallery-filter-item').not(this).animate({height: '0px', padding: '0px', border: '0px'}, 100);
  } else {
    $('.gallery-filter-item').not(this).animate({height: '24px', padding: '15px 30px', border: '1px solid black'}, 100);
    $('.gallery-filter-item').not(this).css({border: '1px solid black'});
  }
});


(function() {
  new Macy({
    container: '.gallery-grid',
    mobileFirst: true,
    breakAt: {
      0: 1,
      600: 2,
      1080: 5
    },
    margin: {
      x: 12,
      y: 12
    }
  });
})();
