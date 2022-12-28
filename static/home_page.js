
function save_entry(new_entry){

    $.ajax({
        type: "POST",
        url: "save_entry",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(new_entry),
        success: function(result){
            let all_data = result
            console.log(all_data)
            tasks = all_data
            display_task_list(tasks)
            $(".list-item-box").val("")
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
        
    });
}


function delete_task(id){

    
        $.ajax({
            type: "POST",
            url: "delete_task",                
            dataType : "json",
            contentType: "application/json; charset=utf-8",
            data : JSON.stringify(id),
            success: function(result){
                console.log(result)
                display_task_list(result)
                $(".list-item-box").val("")
            },
            error: function(request, status, error){
                console.log("Error");
                console.log(request)
                console.log(status)
                console.log(error)
            }
        })
       
}

function replace(new_entry){

    $.ajax({
        type: "POST",
        url: "replace",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(new_entry),
        success: function(result){
            display_task_list(result)
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
        
    });



}

function edit_task(id){


        $.ajax({
            type: "POST",
            url: "edit_task",                
            dataType : "json",
            contentType: "application/json; charset=utf-8",
            data : JSON.stringify(id),
            success: function(result){
                let all_data = result
                $.each(result, function(key, value){

                    let tobe_altered = value.description
                    let id_to_be_altered = value.id
                    $(".display-task-area").append('<input type="text" class="form-control" id="new_description">')
                    $(".form-control").val(tobe_altered)
                    $(".form-control").focus()
                    let submit_button = $('<div class="random" <button id="submit_button" class="btn">submit</button></div>')
                    $(".edit_button_area").append(submit_button)
                    $(submit_button).click(function(){
                    let updated_entry = $(".form-control").val()
                    let replacingentry = {id: id_to_be_altered,description: updated_entry}
                    replace(replacingentry)
                    $(".form-control").focus()
                    
                })
                $(".list-item-box").val("")

                })   
            },
            error: function(request, status, error){
                console.log("Error");
                console.log(request)
                console.log(status)
                console.log(error)
            }
        })
       
}

function display_task_list(tasks){

    $(".display-task-area").empty()
    $(".delete_button_area").empty()
    $(".edit_button_area").empty()
    $(".submit_button_area").empty()

      
        $.each(tasks, function(index, value){

            $(".display-task-area").append('<div class="new-task">' +value.description+ '</div>')
            
            // creating delete button and calling on delete function
            let delete_button = $('<div class="random" <button id="delete_button" class="btn">X</button></div>')
            $(delete_button).click(function(){
                delete_task(value.id)
                display_task_list(tasks)
            })
            $(".delete_button_area").append(delete_button)
            
            let edit_button = $('<div class="edit-b-random" <button id="edit_button" class="btn"> edit </button></div>')
            $(edit_button).click(function(e){
            
                edit_task(value.id)
                $(edit_button).css('pointer-events', 'none');
                
            })
            
            $(".edit_button_area").append(edit_button)
        });



}


$(document).ready(function() {
    
    display_task_list(tasks)

    $(".list-item-box").focus();
    
    $("#add-button").click(function(event) {
      

        if ($.trim($(".list-item-box").val()) === "") {
          $(".list-item-box").focus();
          return false;
        }

        else{
            
            let new_entry = $(".list-item-box").val()
            let unique_id = Math.floor(Math.random()*1000)
            let updating_task_list = {id: unique_id, description: new_entry}
            save_entry(updating_task_list)
            display_task_list(tasks);
            $(".list-item-box").focus();
        }
        
        event.preventDefault();

        
    });

                   

})