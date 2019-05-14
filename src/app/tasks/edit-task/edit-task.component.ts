
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { NgForm } from '@angular/forms';
import { BoxTask } from '../../BoxTask.model';
import { Router, ActivatedRoute } from '@angular/router';
import { TableService } from 'src/app/services/table.service';
import { Box } from 'src/app/Box.model';
import { BoxTaskComment } from 'src/app/BoxTaskComment.module';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})


export class EditTaskComponent implements OnInit, OnDestroy{
  @ViewChild('f') slForm:NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex:number;
  editedItem:Box;
  editedTask: BoxTask;
  editedComment: BoxTaskComment;
  ingredients:BoxTask[] ;
  ingredient: Box[] ;

  constructor(private boxService: TableService,
              private router:Router,
              private route:ActivatedRoute) { }
  ngOnInit() {
    this.subscription= this.boxService.startedEditing.subscribe(
      (index: number) => {
        this.editedItemIndex=index;
        this.editMode = true;
        this.editedTask=this.boxService.getTask(index);
        this.editedComment=this.boxService.getComment(index);
       
      }
    );

    this.ingredient = this.boxService.getIngredients();
    this.subscription = this.boxService.ingredientsChanged.subscribe(
        (ingredient: Box[]) => {
          this.ingredient = ingredient;
        }
      );
    this.subscription= this.boxService.startedEditing.subscribe(
      (index: number) => {
        this.editedItemIndex=index;
        this.editMode = true;
        this.editedTask=this.boxService.getTask(index);
        this.editedComment=this.boxService.getComment(index);
       
        this.slForm.setValue({
          
          tId: this.editedTask.task_id,
          tTitle: this.editedTask.task_title,
          pIc: this.editedTask.assigned,
          
         })
      }
    );
  }

  onSubmit(form: NgForm) {
    const value= form.value;
    const newTask = new BoxTask(value.tId,value.tTitle,value.pIc,[value.cID,value.cComment, value.cAuthor]);
    if (this.editMode){
      this.boxService.updateTask(this.editedItemIndex,newTask);
    } else  {
      this.boxService.addTask(newTask);
    }  
    this.editMode=false;
    form.reset();
  }
  onClear()
  {
    this.slForm.reset();
    this.editMode=false;
  }
  onDelete(){
    this.boxService.deleteTask(this.editedItemIndex);
    this.onClear();
  }
  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }
  ngOnDestroy(){

    this.subscription.unsubscribe();
  }



}
