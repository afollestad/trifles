class Category {
  /**
   * @param {string} name
   * @param {number|string} id
   */
  constructor(name, id) {
    this.name = name;
    this.id = id;
  }
}

class Question {
  /**
   * @param {string} category
   * @param {string} type
   * @param {string} difficulty
   * @param {string} question
   * @param {string} correct_answer
   * @param {Array.<string>} incorrect_answers
   */
  constructor(category, type, difficulty, question, correct_answer, incorrect_answers) {
    this.category = category;
    this.type = type;
    this.difficulty = difficulty;
    this.question = question;
    this.correct_answer = correct_answer;
    this.incorrect_answers = incorrect_answers;
  }

  get all_answers() {
    if (!this.incorrect_answers) {
      return [];
    }
    const result = this.incorrect_answers;
    result.push(this.correct_answer);
    return shuffleArray(result);
  }
}

/**
 * @param {Array} a
 * @returns {Array}
 */
function shuffleArray(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

class TriviaManager {
  constructor() {}

  /**
   * @returns {TriviaManager}
   */
  static create() {
    return new TriviaManager();
  }

  /**
   * @param {number} amount
   * @param {number|string} category
   * @returns Observable.<Question[]>
   */
  getQuestions(amount, category) {
    if (!amount) {
      amount = 100;
    }
    if (!category || category === '0') {
      category = '';
    }
    const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&type=multiple`;
    const subj = new Rx.Subject();
    fetch(url).then(function (response) {
      return response.json()
    }).then(function (json) {
      const results = shuffleArray(json.results);
      const questions = [];
      for (let i = 0; i < results.length; i++) {
        const res = results[i];
        questions.push(new Question(
          res.category, res.type, res.difficulty, res.question, res.correct_answer, res.incorrect_answers));
      }
      subj.onNext(questions);
    }).catch(function (error) {
      alert(error);
    });
    return subj.asObservable();
  }

  /**
   * @returns {Array.<Category>}
   */
  getCategories() {
    return [
      new Category('All', ''),
      new Category('Animals', 27),
      new Category('Art', 25),
      new Category('Celebrities', 26),
      new Category('Entertainment: Board Games', 16),
      new Category('Entertainment: Books', 10),
      new Category('Entertainment: Cartoons and Animations', 32),
      new Category('Entertainment: Comics', 29),
      new Category('Entertainment: Film', 11),
      new Category('Entertainment: Japanese Anime and Manga', 31),
      new Category('Entertainment: Music', 12),
      new Category('Entertainment: Musicals and Theatres', 13),
      new Category('Entertainment: Television', 14),
      new Category('Entertainment: Video Games', 15),
      new Category('General Knowledge', 9),
      new Category('Geography', 22),
      new Category('History', 23),
      new Category('Mythology', 20),
      new Category('Politics', 24),
      new Category('Science and Nature', 17),
      new Category('Science: Computers', 18),
      new Category('Science: Gadgets', 30),
      new Category('Science: Mathematics', 19),
      new Category('Sports', 21),
      new Category('Vehicles', 28),
    ];
  }
}

window.Category = Category;
window.Question = Question;
window.TriviaManager = TriviaManager;