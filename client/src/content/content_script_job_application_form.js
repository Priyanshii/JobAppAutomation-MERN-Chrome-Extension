let currentTabUrl;

function findQuestionType(element, inputElement, selectElement, textAreaElement) {
  let inputType;

  if (inputElement) {
    inputType = inputElement.getAttribute('type');
    inputName = inputElement.getAttribute('name');
  } else if (selectElement) {
    inputType = 'dropdown'
  } else if (textAreaElement) {
    inputType = 'textArea'
  } else {
    inputType = 'unknown'
  }
  return inputType;
}

function findQuestionName(element, inputElement) {
  let inputName;

  if (inputElement) {
    inputName = inputElement.getAttribute('name');
  }
  return inputName;
}

function findInputOptions(element, inputElement, selectElement, textAreaElement) {
  let options = [];

  const inputType = findQuestionType(element, inputElement, selectElement, textAreaElement);
  const inputName = findQuestionName(element);

  if (inputType === 'dropdown') {
    const optionElements = selectElement.querySelectorAll('option');
    optionElements.forEach((optionElement) => {
      options.push(optionElement.textContent);
    });
  } else if (inputType === 'radio' || inputType === 'checkbox') {
    const optionElements = element.querySelectorAll(`label input[name="${inputName}"]`);
    optionElements.forEach((optionElement) => {
      const label = optionElement.closest('label');
      options.push(label.textContent);
    });
  }
  return options;
}

function fillingInputWithDefaultValues(inputType, inputName, element, inputElement, selectElement, textAreaElement ) {

  if (inputElement) {
    if (inputType === 'text') {

      inputElement.value = 'aaa';

    } else if (inputType === 'email') {

      inputElement.value = 'aaa@gmail.com';

    } else if (inputType === 'checkbox') {

      const checkboxElements = element.querySelectorAll(`input[name="${inputName}"]`);
      if (checkboxElements.length > 0) {
        checkboxElements[0].checked = true;
      }
    } else if (inputType === 'radio') {
      const radioElements = element.querySelectorAll(`input[name="${inputName}"]`);
      if (radioElements.length > 0) {
        radioElements[0].checked = true;
      }
    } else if (inputType === 'file') {
      const dataTransfer = new DataTransfer()

      const file = new File(['Hello world!'], 'hello.txt', { type: 'text/plain' })
      dataTransfer.items.add(file)
      inputElement.files = dataTransfer.files;
      const selectFileLabel = element.querySelector('.default-label');
      selectFileLabel.textContent = 'hello.txt'
    }
  } else if (inputType === 'dropdown') {
    for (let i = 0; i < selectElement.options.length; i++) {
      const option = selectElement.options[i];

      if (option.value.trim() !== '') {
        option.selected = true;
        break;
      }
    }
  } else if (inputType === 'textArea') {
    textAreaElement.value = 'aaa';
  }
}

async function detectQuestionsOnCurrentPage() {
  const questions = [];

  const formElements = document.querySelectorAll('.application-form:not(.hidden)');

  var questionElements = [];
  formElements.forEach(function (form) {
    var questionElement = form.querySelectorAll('.application-question');
    questionElements.push(...questionElement);
  });

  questionElements.forEach((element) => {
    const labelElement = element.querySelector(".application-label");
    let questionText;

    if (labelElement) {
      questionText = labelElement.textContent;
    } else {
      questionText = element.textContent
    }

    const inputElement = element.querySelector("input");
    const selectElement = element.querySelector("select");
    const textAreaElement = element.querySelector("textarea");
    
    const inputType = findQuestionType(element, inputElement, selectElement, textAreaElement);
    const inputName = findQuestionName(element, inputElement);
    console.log(inputType);
    // let inputType;
    // if (inputElement) {
    //   inputType = inputElement.getAttribute('type');
    //   inputName = inputElement.getAttribute('name');

    // } else if (selectElement) {
    //   inputType = 'dropdown'
    // } else if (textAreaElement) {
    //   inputType = 'textArea'
    // } else {
    //   inputType = 'unknown'
    // }

    const options = findInputOptions(element, inputElement, selectElement, textAreaElement);

    // const options = [];
    // if (selectElement) {
    //   const optionElements = selectElement.querySelectorAll('option');
    //   optionElements.forEach((optionElement) => {
    //     options.push(optionElement.textContent);
    //   });
    // } else if (inputElement && (inputType === 'radio' || inputType === 'checkbox')) {

    //   const optionElements = element.querySelectorAll(`label input[name="${inputName}"]`);
    //   optionElements.forEach((optionElement) => {
    //     const label = optionElement.closest('label');
    //     options.push(label.textContent);
    //   });
    // }

    const question = {
      text: questionText,
      type: inputType,
      options: options,
    };

    questions.push(question);

    fillingInputWithDefaultValues(inputType, inputName, element, inputElement, selectElement, textAreaElement ) 

  //   if (inputElement) {
  //     if (inputType === 'text') {

  //       inputElement.value = 'aaa';

  //     } else if (inputType === 'email') {

  //       inputElement.value = 'aaa@gmail.com';

  //     } else if (inputType === 'checkbox') {

  //       const checkboxElements = element.querySelectorAll(`input[name="${inputName}"]`);
  //       if (checkboxElements.length > 0) {
  //         checkboxElements[0].checked = true;
  //       }
  //     } else if (inputType === 'radio') {
  //       const radioElements = element.querySelectorAll(`input[name="${inputName}"]`);
  //       if (radioElements.length > 0) {
  //         radioElements[0].checked = true;
  //       }
  //     } else if (inputType === 'file') {
  //       const dataTransfer = new DataTransfer()

  //       const file = new File(['Hello world!'], 'hello.txt', { type: 'text/plain' })
  //       dataTransfer.items.add(file)
  //       inputElement.files = dataTransfer.files
  //       const selectFileLabel = element.querySelector('.default-label');
  //       selectFileLabel.textContent = 'hello.txt'
  //     }
  //   } else if (inputType === 'dropdown') {
  //     for (let i = 0; i < selectElement.options.length; i++) {
  //       const option = selectElement.options[i];

  //       if (option.value.trim() !== '') {
  //         option.selected = true;
  //         break;
  //       }
  //     }
  //   } else if (inputType === 'textArea') {
  //     textAreaElement.value = 'aaa';
  //   }
  });

  chrome.runtime.sendMessage({ type: 'detectedJobApplicationQuestions', link: currentTabUrl, questions: questions }).then((response) => {
    console.log("Questions on Job Url Sent!");
  });
  console.log(questions);

  const submitButton = document.getElementById('btn-submit');
  console.log(submitButton);
  await submitButton.click();
}

detectQuestionsOnCurrentPage();