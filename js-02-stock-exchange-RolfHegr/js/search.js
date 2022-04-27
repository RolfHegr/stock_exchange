class SearchForm {
  constructor(htmlElement) {
    this.htmlElement = htmlElement;
    this.createDivs();
  }

  //Creates div elements
  createDivs() {
    const innerForm = document.createElement("div");
    const searchAndResultsContainer = document.getElementById(
      "searchAndResultsContainer"
    );
    innerForm.classList.add(
      "d-flex",
      "flex-column",
      "flex-shrink-1",
      "flex-grow-1",
      "justify-content-between"
    );
    this.htmlElement.append(innerForm);

    const darkModeContainer = document.createElement("div");
    darkModeContainer.innerHTML = ` 
      <div id="clickableDarkmode" class="form-check form-switch d-flex justify-content-center pb-2">
      <input class="form-check-input" height="" type="checkbox" id="flexSwitchCheckChecked">
      <label class="form-check-label" for="flexSwitchCheckChecked">Darkmode</label>
    </div>`;

    searchAndResultsContainer.append(darkModeContainer);

    const h1 = document.createElement("h1");
    h1.innerHTML = `<h1 class="d-flex justify-content-center mt-4" id="pageTitle">Stock Exchange</h1>`;
    innerForm.append(h1);

    const inputGroup = document.createElement("div");
    inputGroup.classList.add("input-group");
    innerForm.append(inputGroup);

    const formOutline = document.createElement("div");
    formOutline.classList.add("form-outline", "d-flex", "gap-1");
    inputGroup.append(formOutline);

    const searchInput = document.createElement("div");
    searchInput.innerHTML = `<input id="searchBar"  type="search" placeholder="Search Stock" id="form1" class="form-control w-100"
        name="searchBar"/>`;
    formOutline.append(searchInput);

    const searchButton = document.createElement("button");
    searchButton.innerHTML = `<button id="searchBtn" type="button" class="btn btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            class="bi bi-search" viewBox="0 0 16 16">
            <path
                d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
        </svg>
    </button>`;

    formOutline.append(searchButton);

    const spinnerDiv = document.createElement("div");
    formOutline.append(spinnerDiv);

    const spinner = document.createElement("div");
    spinner.innerHTML = `<div id="spinner" class="mx-1 text-primary spinner-border invisible" role="status"><span class="sr-only"></span</div>`;
    spinnerDiv.append(spinner);

    const newAlert = document.createElement("div");
    newAlert.classList.add(
      "d-flex",
      "justify-content-center",
      "align-items-center"
    );
    newAlert.innerHTML = `<div id="error" class="alert alert-danger d-none">
          <strong>OOPS</strong> No companies found..
        </div>`;

    innerForm.append(newAlert);
  }

  //activates DarkMode
  acticvatingDarkmode() {
    const toggleDarkmode = document.getElementById("clickableDarkmode");

    if (toggleDarkmode.classList.contains("is-checked")) {
      const allElements = document.getElementsByTagName(
        "html",
        "body",
        "div",
        "h1",
        "p",
        "body",
        "button"
      );

      if (toggleBtn.checked === true) {
        for (const elem of allElements) {
          elem.classList.add("darkmode");
        }
      }
      if (toggleBtn.checked === false) {
        for (const elem of allElements) {
          elem.classList.remove("darkmode");
        }
      }
    }
  }


  onSearch(callback) {
    //Calls Darkmode Funk
    this.acticvatingDarkmode();


    //Listens for Click on #searchBtn
    const searchBtn = document.getElementById("searchBtn");
    searchBtn.addEventListener("click", () => {
      document.getElementById("spinner").classList.remove("invisible");
      const searchInput = document.getElementById("searchBar");
      const searchValue = searchInput.value;
      callback(searchValue);
    });

    //Implements Search using the 'Enter'-key
    document
      .getElementById("searchBar")
      .addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
          document.getElementById("spinner").classList.remove("invisible");
          const searchInput = document.getElementById("searchBar");
          const searchValue = searchInput.value;
          callback(searchValue);
        }
      });

    // Eventlistener for Darkmode
    document
      .getElementById("clickableDarkmode")
      .addEventListener("click", function (event) {
        const toggleBtn = document.getElementById("flexSwitchCheckChecked");
        toggleBtn.classList.add("is-checked");
        const allElements = document.getElementsByTagName(
          "html",
          "body",
          "div",
          "h1",
          "p",
          "body",
          "button"
        );

        if (toggleBtn.checked === true) {
          for (const elem of allElements) {
            elem.classList.add("darkmode");
          }
        }
        if (toggleBtn.checked === false) {
          for (const elem of allElements) {
            elem.classList.remove("darkmode");
            toggleBtn.classList.remove("is-checked");
          }
        }
      });
  }
}


