dbImage = {
  path: "",
  description: "",
  url: "",
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

function fetchImages(num_images) {
  return new Promise(resolve => {
    $.get('/getIdeas', function(ideas) {
      resolve(ideas);
    })
  });
}

async function insertImages(numImages) {
  const container = document.getElementById('main-gallery');
  const fragment = document.createDocumentFragment()
  const ideas = await fetchImages(numImages);
  console.log(ideas)
  for (const idea of ideas) {
    const item = document.createElement('a');
    item.href = `/idea/${idea._id}`;
    item.classList.add('gallery-item')
    const img = document.createElement('img');
    img.src = `/uploads/${idea.imageID}.png`
    const title = document.createElement('h3');
    title.innerText = idea.title;

    item.append(img);
    item.append(title);
    fragment.append(item);
  }
  container.append(fragment);
  $('.gallery-filter-item').on('click', function() {
    $(this).toggleClass('selected');
    if ($(this).hasClass('selected')) {
      $('.gallery-filter-item').not(this).animate({height: '0px', padding: '0px', border: '0px'}, 100);
    } else {
      $('.gallery-filter-item').not(this).animate({height: '24px', padding: '15px 30px', border: '1px solid black'}, 100);
      $('.gallery-filter-item').not(this).css({border: '1px solid black'});
    }
  });
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
insertImages(20).then(() => {
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
})

$('.add-idea').on('click', () => {
  $('.add-idea-overlay').fadeIn(300);
});

$('.add-idea-overlay .x').on('click', () => {
  $('.add-idea-overlay').fadeOut(300);
})

$('.image-upload').on('click', () => {
  $('.idea-image').trigger('click');
});

$('.idea-image').on('change', function() {
  const file = this.files[0];
  if (!file) return;
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function() {
    $('.image-upload').css({'background-image': `url(${reader.result})`});
  };
});

$('.save-idea').on('click', function() {
  const title = $('.idea-title').val().trim();
  const desc = $('.idea-desc').val().trim();
  const city = $('.idea-city').val().trim();
  const address = $('.idea-address').val().trim();
  const image = $('.idea-image').get(0).files[0];
  if (!title || !desc || !address || !image || !city) {
    return alert('Fill in all fields and add an image!');
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('desc', desc);
  formData.append('city', city);
  formData.append('address', address);
  formData.append('image', image);

  $.ajax({
    url: '/addIdea',
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    success: function(data) {
      if (!data.success) {
        return alert(data.msg);
      }
      alert('Success!');
      window.location.reload();
    }
  });
});