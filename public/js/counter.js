$('textarea').keypress(function () {

    if (this.value.length > 139) {
      return false;
    }

    $('#remainingChars').html('Remaining characters : ' + (139 - this.value.length));
  });
