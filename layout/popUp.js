export default function popUp(popUp) {
  let _cell;
  function show(cell) {
    popUp.classList.remove('hidden');
    _cell = cell;
  }

  function handleFillIn(e) {
    const popUpCell = e.target;
    let unsureCell = _cell.classList.contains('mark-unsure');
    let goodCell = _cell.classList.contains('mark-good');

    const markUnsure = popUpCell.classList.contains('mark-unsure');
    const markGood = popUpCell.classList.contains('mark-good');
    const markEmpty = popUpCell.classList.contains('mark-empty');
    //when you want to mark an cell unsure
    if (markUnsure) {
      if (unsureCell) {
        _cell.classList.remove('mark-unsure');
      } else {
        goodCell && _cell.classList.remove('mark-good');
        _cell.classList.add('mark-unsure');
      }
    }
    // when you want to mark an cell good
    else if (markGood) {
      if (goodCell) {
        _cell.classList.remove('mark-good');
      } else {
        unsureCell && _cell.classList.remove('mark-unsure');
        _cell.classList.add('mark-good');
      }
    }
    //clear out the content
    else if (markEmpty) {
      unsureCell && _cell.classList.remove('mark-unsure');
      goodCell && _cell.classList.remove('mark-good');
      _cell.textContent = 0;
      _cell.classList.add('empty');
    }
    //fill in the number
    else {
      _cell.textContent = popUpCell.textContent;
      _cell.classList.remove('empty');
    }
    popUp.classList.add('hidden');
    _cell.classList.remove('active');
  }
  function bindClicks() {
    popUp.addEventListener('click', handleFillIn);
  }
  return {
    show,
    bindClicks,
  };
}
