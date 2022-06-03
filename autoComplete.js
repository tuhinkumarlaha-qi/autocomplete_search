const fetchApi = (searchData) => {
  let qParam = { title: searchData };
  let url = new URL("https://jsonplaceholder.typicode.com/todos");
  for (let k in qParam) {
    url.searchParams.append(k, qParam[k]);
  }

  return new Promise((resolve) => {
    fetch(url)
      .then((apiData) => {
        return apiData.json();
      })
      .then((actualData) => {
        let data = actualData;
        resolve(data);
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const autocomplete = (searchInputBox) => {
  let selectedValues = [];
  let matchedValues = [];

  let container = document.getElementById("container");
  let searchField = document.getElementById("searchField");

  searchInputBox.addEventListener("input", function (e) {
    let autoCompleteListContainer,
      fieldValue = this.value;

    closeAllLists();

    if (!fieldValue) {
      return false;
    }

    autoCompleteListContainer = document.createElement("div");
    autoCompleteListContainer.setAttribute(
      "id",
      this.id + "-autocomplete-list"
    );
    autoCompleteListContainer.setAttribute("class", "autocomplete-items");
    container.appendChild(autoCompleteListContainer);

    matchedValues = [];

    fetchApi(fieldValue).then((apiDataArr) => {
      let selectedChipsContainer = document.getElementById(
        "selected-chips-container"
      );
      apiDataArr.forEach((datum) => {
        if (
          datum.title.substr(0, fieldValue.length).toUpperCase() ===
          fieldValue.toUpperCase()
        ) {
          matchedValues.push(datum.title);
          let b = document.createElement("button");
          b.setAttribute("class", "autocomplete-item");
          b.innerHTML =
            "<strong>" + datum.title.substr(0, fieldValue.length) + "</strong>";
          b.innerHTML += datum.title.substr(fieldValue.length);

          matchedValues.forEach((matchValue) => {
            selectedValues.forEach((selectedValue) => {
              if (
                selectedValue === matchValue &&
                b.textContent === matchValue
              ) {
                b.disabled = true;
              }
            });
          });

          b.addEventListener("click", function (e) {
            const chip = document.createElement("span");
            const chipCancel = document.createElement("img");
            const chipText = document.createElement("span");
            chip.setAttribute("class", "chip");
            chipText.setAttribute("class", "chip-text");
            chipCancel.setAttribute("class", "chip-cancel");
            chipCancel.setAttribute("src", "./cancel.png");
            chipText.innerHTML = datum.title;
            chip.appendChild(chipText);
            chip.appendChild(chipCancel);
            selectedValues.push(datum.title);
            selectedChipsContainer.appendChild(chip);

            chipCancel.onclick = () => {
              chip.remove();
              selectedValues = selectedValues.filter(
                (selectedValue) =>
                  selectedValue.toUpperCase() !==
                  chipText.textContent.toLocaleUpperCase()
              );
            };

            closeAllLists();
            searchField.value = "";
          });
          autoCompleteListContainer.appendChild(b);
        }
      });
    });
  });

  const closeAllLists = (elmnt) => {
    let autocompleteList =
      document.getElementsByClassName("autocomplete-items");

    for (let i = 0; i < autocompleteList.length; i++) {
      if (elmnt != autocompleteList[i] && elmnt != searchInputBox) {
        autocompleteList[i].parentNode.removeChild(autocompleteList[i]);
      }
    }
  };

  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
};

autocomplete(searchField);
