import readline from 'readline';
export default class Prompter {
  static async prompt(msg: string) {
    console.log(msg);
    const answer = <string>await this.question('> ');
    return answer.trim();
  }
  private static async question(question: string) {
    const readlineInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    return new Promise((resolve) => {
      readlineInterface.question(question, (answer: string) => {
        resolve(answer);
        readlineInterface.close();
      });
    });
  }
}
