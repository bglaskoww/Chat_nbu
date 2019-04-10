chatwindow_template = {
    chat_template: function (chatWith) {
        return `<div class="card">
		<div class="card-header">Chat with <b> ${chatWith} </b></div>
		<div class="card-body" id="messageDialog"></div>
		<div class="card-footer text-muted">
			<form onSubmit="sendMessage(); return false;" class="form-inline">
				<input type="text" name="message" class="form-control" id="sendMsgField"/>
				<input type="submit" value="send" name="message" class="btn btn-primary"/>
			</form>
		</div>
	</div>`
    }
};
