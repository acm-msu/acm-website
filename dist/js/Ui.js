function Ui() {
    this.events = [];
    this.pastEvents = [];
    this.slider = {};
}

/* Adds an event data object to the UI
@param  {AcmEvent}    event */
Ui.prototype.addEvent = function(event) {
    if (event.past) {
        // We only want 5 past events to show up at a time
        if (this.pastEvents.length < 5) {
            document.querySelector('.past__events').appendChild(
                this.constructPastEventHtml(event)
            );
            this.pastEvents.push(event);
        }
    } else {
        var eventsPlaceholder = document.querySelector('.events__placeholder');
        var eventsPlaceholderStyles = window.getComputedStyle(eventsPlaceholder);
        
        if (eventsPlaceholderStyles.getPropertyValue('display') === 'block') {
            eventsPlaceholder.style.display = 'none';
        }
        
        document.querySelector('.events__wrapper').appendChild(
            this.constructUpcomingEventHtml(event)
        );
        this.events.push(event);
    }
}

/* Adds a board member to the UI
@param  {AcmEvent}    event */
Ui.prototype.addMember = function(member) {
    var memberHtml = this.constructMemberHtml(member);

    document.querySelector('.board__wrapper').appendChild(memberHtml);
}

/* Constructs HTML for upcoming event
@param  {AcmEvent}          event
@return {HTMLDivElement}    HTML that can be appended to the page */
Ui.prototype.constructUpcomingEventHtml = function(event) {
    var title = document.createElement('h1');
    title.innerHTML = event.title;
    title.className = 'event__head';

    var date = document.createElement('p');
    date.innerHTML = '<i class="far fa-calendar-alt"></i>' + this.formatDate(event.date, false);
    date.className = 'event__date';

    var location = document.createElement('p');
    location.innerHTML = '<i class="fas fa-map-marked-alt"></i>' + event.location;
    location.className = 'event__location';

    var description = document.createElement('p');
    description.innerHTML = event.description;
    description.className = 'event__desc';

    var image = document.createElement('div');
    image.className = 'event__image';
    image.alt = event.imageDescription;
    image.style.backgroundImage = 'url(' + event.image + ')';
    image.style.backgroundRepeat = 'no-repeat';
    image.style.backgroundSize = 'cover';

    var eventHtml = document.createElement('div');
    eventHtml.className = 'event';

    eventHtml.appendChild(image);
    eventHtml.appendChild(title);
    eventHtml.appendChild(date);
    eventHtml.appendChild(location);    
    eventHtml.appendChild(description);
    

    return eventHtml;
}

/* Constructs HTML for past event
@param  {AcmEvent}          event
@return {HTMLDivElement}    HTML that can be appended to the page */
Ui.prototype.constructPastEventHtml = function(event) {
    var title = document.createElement('h1');
    title.innerHTML = event.title;
    title.className = 'pastEvent__head';

    var date = document.createElement('p');
    date.innerHTML = '<i class="far fa-calendar-alt"></i>' + this.formatDate(event.date, true);
    date.className = 'pastEvent__date';

    var description = document.createElement('p');
    description.innerHTML = event.description;
    description.className = 'pastEvent__desc';

    var image = document.createElement('div');
    image.className = 'pastEvent__image';
    image.alt = event.imageDescription;
    image.style.backgroundImage = 'url(' + event.image + ')';

    var eventHtml = document.createElement('div');
    eventHtml.className = 'pastEvent glide__slide';

    eventHtml.appendChild(date);
    eventHtml.appendChild(image);
    eventHtml.appendChild(title);
    
    eventHtml.appendChild(description);

    return eventHtml;
}

/* Constructs HTML for board member
@param  {AcmEvent}          event
@return {HTMLDivElement}    HTML that can be appended to the page */
Ui.prototype.constructMemberHtml = function(member) {
    var top = document.createElement('div');
    top.className = 'member__top';

    var image = document.createElement('img');
    image.className = 'member__image';
    image.src = member.image;

    top.appendChild(image);

    var head = document.createElement('h2');
    head.className = 'member__head';
    head.innerHTML = member.name;

    var title = document.createElement('p');
    title.className = 'member__title';
    title.innerHTML = member.title;

    var memberHtml = document.createElement('div');
    memberHtml.className = 'member';

    memberHtml.appendChild(top);
    memberHtml.appendChild(head);
    memberHtml.appendChild(title);

    return memberHtml;
}

/* Initializes a slider on the selected element
@param  {String}    elementSelector */
Ui.prototype.constructSlider = function(elementSelector) {
    this.slider = new Glide(elementSelector, {
        perView: 3.15,
        gap: 40,
        focusAt: 'center',
        breakpoints: {
            1400: {
                perView: 2.15,
                gap: 30
            },
            675: {
                perView: 1.15,
                gap: 20
            }
        }
    }).mount();

    var sliderRightArrow = document.querySelector('.glide__arrow--right');
    var sliderLeftArrow = document.querySelector('.glide__arrow--left');

    sliderLeftArrow.style.display = 'none';
    
    var pastEventsAmount = this.pastEvents.length;

    if (pastEventsAmount > 0) {
        sliderRightArrow.style.display = 'block';
    }
    
    var pastEventsAmount = this.pastEvents.length;

    if (this.slider.index === pastEventsAmount-1) {
        sliderRightArrow.style.display = 'none';
    }

    var slideChanged = function() {
        if (this.slider.index === 0) {
            sliderLeftArrow.style.display = 'none';
        } else if (this.slider.index > 0) {
            sliderLeftArrow.style.display = 'block';
        }

        if (pastEventsAmount > 1) {
            sliderRightArrow.style.display = 'block';
        } else {
            sliderRightArrow.style.display = 'none';
        }

        if (pastEventsAmount-1 === this.slider.index) {
            sliderRightArrow.style.display = 'none';
        }

        // var pastSection = document.querySelector('.past');

        // console.log(this.pastEvents[this.slider.index].image);

        // pastSection.style.background = 'radial-gradient(hsla(240, 10%, 30%, 1), hsla(240, 10%, 30%, 0.8) ), url(' + 
        //                                this.pastEvents[this.slider.index].image + ')';
        // pastSection.style.backgroundSize = 'cover';
        // pastSection.style.backgroundRepeat = 'no-repeat';
    }

    this.slider.on('run', slideChanged.bind(this));
}

/* Formats raw date that is displayed in event card
@param  {Date}              d
@return {String}            Formatted date string */
Ui.prototype.formatDate = function(d, isPast) {
    var months = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 
        'August', 'September', 'October', 'November', 'December'
    ];
    
    var dateSuffix = 'th';
    if (((d.getDate() % 10) === 1) && (d.getDate() !== 11)) {
        dateSuffix = 'st';
    } else if (((d.getDate() % 10) === 2) && (d.getDate() !== 12)) {
        dateSuffix = 'nd';
    }

    var meridiem = 'AM';
    var meridiemHours = d.getHours();
    if (d.getHours() >= 12) {
        meridiem = 'PM';
        if (d.getHours() !== 12)
            meridiemHours -= 12;
    }
    if (d.getHours() === 0)
        meridiemHours = 12;


    var minutesString = String(d.getMinutes());
    if (minutesString.length <= 1)
        minutesString = '0' + minutesString;


    var dateString = months[d.getMonth()] + ' ' + d.getDate() + dateSuffix + 
                     ', ' + d.getFullYear();
    
    if (!isPast)
        dateString += ' at ' + 
        meridiemHours + ':' + minutesString + ' ' + meridiem;

    return dateString;
}

/* Initializes dynamic "typed" text on param element
@param  {String}             element */
Ui.prototype.constructTyped = function(element) {
    var typedOptions = {
        strings: ['students', 'developers', 'hobbyists', 'spartans'],
        typeSpeed: 100,
        startDelay: 300,
        backSpeed: 50,
        backDelay: 3000,
        loop: true
    }
    
    new Typed(element, typedOptions);
}

Ui.prototype.initializeLightbox = function() {
    var pastEventImages = document.getElementsByClassName('pastEvent__image');
    var upcomingEventImages = document.getElementsByClassName('event__image');

    var imageClickEvent = function(image) {
        var lightbox = document.querySelector('.lightbox');
        var lightboxImage = document.querySelector('.lightbox__image');
        lightboxImage.src = image;
        lightbox.style.display = 'flex';
    }

    for (var i=0; i < pastEventImages.length; i++) {
        var imageUrl = window.getComputedStyle(pastEventImages[i]).getPropertyValue('background-image').split('"')[1];
        pastEventImages[i].addEventListener('click', imageClickEvent.bind(null, imageUrl));
    }

    for (var i=0; i < upcomingEventImages.length; i++) {
        var imageUrl = window.getComputedStyle(upcomingEventImages[i]).getPropertyValue('background-image').split('"')[1];
        upcomingEventImages[i].addEventListener('click', imageClickEvent.bind(null, imageUrl));
    }

    // Close button functionality
    var lightboxClose = document.querySelector('.lightbox__close');
    lightboxClose.addEventListener('click', function() {
        var lightbox = document.querySelector('.lightbox');
        lightbox.style.display = 'none';
    });

    document.querySelector('.lightbox').addEventListener('click', function() {
        var lightbox = document.querySelector('.lightbox');
        lightbox.style.display = 'none';
    });
}