import {Component, OnInit, OnDestroy} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormArray,
    FormControl
} from '@angular/forms';

import {Category, Question, Answer} from '../../model';
import {CategoryService, TagService, QuestionService} from '../../services';
import {Router, ActivatedRoute} from '@angular/router';

import {debounceTime, filter, map} from 'rxjs/operators';
import {Observable, forkJoin} from 'rxjs';
import {AppStore} from '../../store/app-store';
import {select, Store} from '@ngrx/store';
import {QuestionActions} from '../../store/actions';
import {MatSnackBar} from '@angular/material';
import {CustomSnackBarComponent} from '../custom-snack-bar/custom-snack-bar.component';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'question-add-update',
    templateUrl: './question-add-update.component.html',
    styleUrls: ['./question-add-update.component.scss']
})
export class QuestionAddUpdateComponent implements OnInit, OnDestroy {
    // Properties
    categories: Category[];
    sub: any;

    tags: string[];
    sub2: any;

    questionForm: FormGroup = new FormGroup({});
    question: Question;
    preselectedQuestion: Question;

    store$: Observable<AppStore>;

    autoTags: string[] = []; // auto computed based on match within Q/A
    enteredTags: string[] = [];

    get answers(): FormArray {
        return this.questionForm.get('answers') as FormArray;
    }

    get tagsArray(): FormArray {
        return this.questionForm.get('tagsArray') as FormArray;
    }

    // Constructor
    constructor(
        private fb: FormBuilder,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private categoryService: CategoryService,
        private tagService: TagService,
        private questionService: QuestionService,
        private store: Store<AppStore>,
        private snackBar: MatSnackBar
    ) {
        this.store$ = store.pipe(select(state => state));
    }

    ngOnInit() {
        // Read the Query param from the Activated Route
        let questionID: string;

        this.activatedRoute.queryParamMap.pipe(
            map(params => params.get('question_id') || null)
        ).subscribe(
            param => {
                questionID = param;
                // Get the questions if the ID is null
                // If the ID is not null, fetch the Questions from backend
                // this.getQuestion(questionID).subscribe(
                //   question => {
                //     console.log('Question Record.......');
                //     console.log(question);
                //     this.intializeForm(question);
                //   }
                // );
                /*forkJoin(
                    {
                        question_response: this.getQuestion(questionID),
                        categories_response: this.categoryService.getCategories(),
                        tags_response: this.tagService.getTags()
                    }
                ).subscribe(
                    response => {
                        this.preselectedQuestion = response.question_response;
                        this.categories = response.categories_response;
                        this.tags = response.tags_response;
                        // Send the question retrieved as a part of body to the form initializer
                        this.initializeForm(this.preselectedQuestion);
                    }
                );*/

                // Subscribe to the Store and populate the tags, components and get the question
                this.store$.subscribe(
                    store => {
                        if (questionID !== null) {
                            // Iterate over the questions and get the question with the same ID
                            store.questions.forEach((question) => {
                                // tslint:disable-next-line:radix
                                if (question.id === +questionID) {
                                    this.preselectedQuestion = question;
                                }
                            });
                        }
                        // Load Tags and Categories from the store
                        this.tags = store.tags;
                        this.categories = store.categories;
                        // Send the question retrieved as a part of body to the form initializer
                        this.initializeForm(this.preselectedQuestion);
                    }
                );
            }
        );

        /*this.sub = this.categoryService
            .getCategories()
            .subscribe(categories => (this.categories = categories));

        this.sub2 = this.tagService.getTags().subscribe(tags => (this.tags = tags));*/
    }

    initializeForm(question: Question) {
        // Take the pre-filled question object
        // If that is null, initialize the question with an empty object

        if (question != null) {
            this.question = question;
        } else {
            this.question = new Question();
        }

        this.createForm(this.question);

        const questionControl = this.questionForm.get('questionText');

        questionControl.valueChanges
            .pipe(debounceTime(500))
            .subscribe(v => this.computeAutoTags());
        this.answers.valueChanges
            .pipe(debounceTime(500))
            .subscribe(v => this.computeAutoTags());
    }

    getQuestion(questionID: string): Observable<Question> {
        // Check if the ID is not null,
        // Fetch the question from the DB
        // If ID === null then initialize the table with default values
        return this.questionService.getQuestion(questionID);
    }

    // Event Handlers
    addTag() {
        const tag = this.questionForm.get('tags').value;
        if (tag) {
            if (this.enteredTags.indexOf(tag) < 0) {
                this.enteredTags.push(tag);
            }
            this.questionForm.get('tags').setValue('');
        }
        this.setTagsArray();
    }

    removeEnteredTag(tag) {
        this.enteredTags = this.enteredTags.filter(t => t !== tag);
        this.setTagsArray();
    }

    initializeTags(question: Question) {
        // Read the tags from the Question model from the backend
        // Check for the Tag's existence in the list of pre-selected Tags from the Tag service
        // If the tag doesn't match the pre-existing tags then push it to the enteredTags array
        if (this.enteredTags.length === 0 && this.autoTags.length === 0) {
            question.tags.forEach((value, index) => {
                if (this.tags.indexOf(value) < 0) {
                    this.enteredTags.push(value);
                } else {
                    this.autoTags.push(value);
                }
            });
        }
    }

    onSubmit() {
        // validations
        this.questionForm.updateValueAndValidity();
        if (this.questionForm.invalid) {
            return;
        }

        // get question object from the forms
        const question: Question = this.getQuestionFromFormValue(
            this.questionForm.value
        );

        // call saveQuestion
        this.saveQuestion(question);
    }

    // Helper functions
    getQuestionFromFormValue(formValue: any): Question {
        let question: Question;

        question = new Question();
        question.questionText = formValue.questionText;
        question.answers = formValue.answers;
        question.categoryIds = [formValue.category];
        question.categoryIds.forEach((selectedCategoryId) => {
            question.categories.push(this.categories.find(
                (category) => category.id === selectedCategoryId
            ));
        });
        question.tags = [...this.autoTags, ...this.enteredTags];
        question.ordered = formValue.ordered;
        question.explanation = formValue.explanation;

        return question;
    }

    saveQuestion(question: Question) {
        // Check if the question record has an ID
        // If there is a question ID, send a PUT request to update the record
        // If there is no question ID, send a POST request to create the record
        if (this.preselectedQuestion != null) {
            // Set the preselected question ID to the new record
            // the ID would be assigned to the new record
            question.id = this.preselectedQuestion.id;
            // Send a PUT request to the backend
            // Updates the same question record
            /*this.questionService.updateQuestion(question).subscribe(response => {
                console.log('navigating ...');
                this.router.navigate(['/questions']);
            });*/

            // Dispatch the intent to update the question in the store
            this.store.dispatch(QuestionActions.updateQuestion({question}));
            // Wait for the Question to get updated in the backend
            // Show a snack bar and navigate to the Questions page
            this.store.select(store => store.questionSaveStatus ).pipe(
                filter(status => status === 'SUCCESS' )
            ).subscribe(
                () => {
                    this.snackBar.openFromComponent(CustomSnackBarComponent,
                        {
                            data: `Question has been updated!`,
                            duration: 2000
                        }
                    );
                    // Navigate to the Questions List Page
                    this.router.navigate(['/questions']);
                }
            );

        } else {
            // Send a POST request to the backend
            // Creates a new record
            /*this.questionService.saveQuestion(question).subscribe(response => {
                console.log('navigating ...');
                this.router.navigate(['/questions']);
            });*/

            // Dispatch the intent to update the question in the store
            this.store.dispatch(QuestionActions.addQuestion({question}));
            // Wait for the Question to get updated in the backend
            // Show a snack bar and navigate to the Questions page
            this.store.select(store => store.questionSaveStatus ).pipe(
                filter(status => status === 'SUCCESS' )
            ).subscribe(
                () => {
                    this.snackBar.openFromComponent(CustomSnackBarComponent,
                        {
                            data: `Question has been added!`,
                            duration: 2000
                        }
                    );
                    // Navigate to the Questions List Page
                    this.router.navigate(['/questions']);
                }
            );
        }
    }

    computeAutoTags() {
        const formValue = this.questionForm.value;

        const allTextValues: string[] = [formValue.questionText];
        formValue.answers.forEach(answer => allTextValues.push(answer.answerText));

        const wordString: string = allTextValues.join(' ');

        const matchingTags: string[] = [];
        this.tags.forEach(tag => {
            const patt = new RegExp('\\b(' + tag.replace('+', '\\+') + ')\\b', 'ig');
            if (wordString.match(patt)) {
                matchingTags.push(tag);
            }
        });
        this.autoTags = matchingTags;

        this.setTagsArray();
    }

    setTagsArray() {
        this.tagsArray.controls = [];
        [...this.autoTags, ...this.enteredTags].forEach(tag =>
            this.tagsArray.push(new FormControl(tag))
        );
    }

    createForm(question: Question) {
        const fgs: FormGroup[] = question.answers.map(answer => {
            const fg = new FormGroup({
                answerText: new FormControl(answer.answerText, Validators.required),
                correct: new FormControl((answer.correct == null) ? false : answer.correct)
            });
            return fg;
        });
        const answersFA = new FormArray(fgs);

        let fcs: FormControl[] = question.tags.map(tag => {
            const fc = new FormControl(tag);
            return fc;
        });

        if (fcs.length === 0) {
            fcs = [new FormControl('')];
        }
        const tagsFA = new FormArray(fcs);
        // Initialize the Entered Tags and Matched Tags
        // If the question might have the tags pre-selected
        this.initializeTags(question);

        this.questionForm = this.fb.group(
            {
                category: [
                    question.categories.length > 0 ? question.categories[0].id : '',
                    Validators.required
                ],
                questionText: [question.questionText, Validators.required],
                tags: '',
                tagsArray: tagsFA,
                answers: answersFA,
                ordered: [question.ordered],
                explanation: [question.explanation]
            },
            {
                validator: questionFormValidator
            }
        );
    }

    ngOnDestroy(): void {
    }
}

// Custom Validators
function questionFormValidator(
    fg: FormGroup
): {
    [key: string]: boolean;
} {
    const answers: Answer[] = fg.get('answers').value;
    if (answers.filter(answer => answer.correct).length !== 1) {
        return {
            correctAnswerCountInvalid: true
        };
    }

    const tags: string[] = fg.get('tagsArray').value;
    if (tags.length < 3) {
        return {
            tagCountInvalid: true
        };
    }

    return null;
}
