'use strict';

const MAIN_PIN_OFFSET_X = 65;
const MAIN_PIN_OFFSET_Y = 65;
const MAIN_PIN_ACTIVE_OFFSET_Y = 84;

const mainPin = document.querySelector(`.map__pin--main`);
const adForm = document.querySelector(`.ad-form`);
const inputTitle = adForm.querySelector(`#title`);
const inputAddress = adForm.querySelector(`#address`);
const inputPrice = adForm.querySelector(`#price`);
const typeSelect = adForm.querySelector(`#type`);
const checkInSelect = adForm.querySelector(`#timein`);
const checkOutSelect = adForm.querySelector(`#timeout`);
const roomNumberSelect = adForm.querySelector(`#room_number`);
const guestsNumberSelect = adForm.querySelector(`#capacity`);
const inputAvatar = adForm.querySelector(`#avatar`);
const previewAvatar = adForm.querySelector(`.ad-form-header__preview img`);
const inputImages = adForm.querySelector(`#images`);
const previewImages = adForm.querySelector(`.ad-form__photo`);
const titleMinLength = inputTitle.minLength;
const titleMaxLength = inputTitle.maxLength;

const typeToMinPrice = {
  palace: 10000,
  house: 5000,
  flat: 1000,
  bungalow: 0,
};

let isPageActive = false;

const getValidityErrorMap = () => ({
  badInput: `Только числовое значение`,
  rangeOverflow: `Максимальная цена - ${inputPrice.max}`,
  rangeUnderflow: `Минимальная цена - ${inputPrice.min}`,
  valueMissing: `Заполните это поле`,
});

const setAddress = () => {
  const mainPinTop = parseInt(mainPin.style.top, 10);
  const mainPinLeft = parseInt(mainPin.style.left, 10);

  const x = Math.floor(mainPinLeft + MAIN_PIN_OFFSET_X / 2);
  const y = (window.form.isPageActive) ? mainPinTop + MAIN_PIN_ACTIVE_OFFSET_Y : Math.floor(mainPinTop + MAIN_PIN_OFFSET_Y / 2);

  inputAddress.value = `${x}, ${y}`;
};

const onTitleValidation = () => {
  let valueLength = inputTitle.value.length;

  if (valueLength < titleMinLength) {
    inputTitle.setCustomValidity(`Минимум ${titleMinLength} символов, добавьте ещё ${titleMinLength - valueLength}`);
  } else if (valueLength > titleMaxLength) {
    inputTitle.setCustomValidity(`Максимум ${titleMaxLength} символов, удалите лишние ${valueLength - titleMaxLength}`);
  } else {
    inputTitle.setCustomValidity(``);
  }
  inputTitle.reportValidity();
};

const onPriceValidation = () => {
  const validityErrorMap = getValidityErrorMap();
  const errorValue = Object.keys(validityErrorMap).find((value) => inputPrice.validity[value]);
  inputPrice.setCustomValidity(errorValue ? validityErrorMap[errorValue] : ``);
};

const setMinPrice = (minPrice) => {
  inputPrice.setAttribute(`min`, minPrice);
  inputPrice.setAttribute(`placeholder`, minPrice);
};

const onPriceSelectChange = () => {
  setMinPrice(typeToMinPrice[typeSelect.value]);
};

const onCheckInOutChange = (evt) => {
  checkInSelect.value = evt.target.value;
  checkOutSelect.value = evt.target.value;
};

const onRoomsCapacityValidation = () => {
  const rooms = roomNumberSelect.value;
  const guests = guestsNumberSelect.value;
  const roomsMaxValue = `100`;
  const guestsMinValue = `0`;

  if ((rooms === roomsMaxValue && guests !== guestsMinValue) || (rooms !== roomsMaxValue && guests === guestsMinValue)) {
    guestsNumberSelect.setCustomValidity(`Возможен только вариант: 100 комнат - не для гостей`);
  } else if (rooms !== roomsMaxValue && rooms < guests) {
    guestsNumberSelect.setCustomValidity(`Количество комнат не может быть меньше числа гостей`);
  } else {
    guestsNumberSelect.setCustomValidity(``);
  }
  guestsNumberSelect.reportValidity();
};

const resetCheckboxes = () => {
  const checkboxes = document.querySelectorAll(`input[type="checkbox"]:checked`);

  checkboxes.forEach((elem) => {
    elem.checked = false;
  });
};

const enableForm = () => {
  adForm.classList.remove(`ad-form--disabled`);

  window.util.toggleFormElements(adForm);
};

const disableForm = () => {
  if (!adForm.classList.contains(`ad-form--disabled`)) {
    adForm.classList.add(`ad-form--disabled`);
  }

  resetCheckboxes();
  adForm.reset();
  window.upload.removeImagePreview(previewAvatar);
  window.upload.removeImagePreview(previewImages);
  window.util.toggleFormElements(adForm, true);
  setAddress();
};

setMinPrice(typeToMinPrice[typeSelect.value]);
onPriceValidation();
onRoomsCapacityValidation();

inputTitle.addEventListener(`change`, onTitleValidation);
inputPrice.addEventListener(`change`, onPriceValidation);
typeSelect.addEventListener(`change`, onPriceSelectChange);
checkInSelect.addEventListener(`change`, onCheckInOutChange);
checkOutSelect.addEventListener(`change`, onCheckInOutChange);
roomNumberSelect.addEventListener(`change`, onRoomsCapacityValidation);
guestsNumberSelect.addEventListener(`change`, onRoomsCapacityValidation);
inputAvatar.addEventListener(`change`, () => window.upload.setImagePreview(inputAvatar, previewAvatar));
inputImages.addEventListener(`change`, () => window.upload.setImagePreview(inputImages, previewImages));

window.form = {
  MAIN_PIN_OFFSET_X,
  MAIN_PIN_ACTIVE_OFFSET_Y,
  isPageActive,
  enable: enableForm,
  disable: disableForm,
  setAddress,
};
