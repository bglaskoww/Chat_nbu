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

chatlogin_template = {
    chat_template2: function () {
        return `<div class="form-group mx-sm-3">
                    <label for="nickname">Nickname</label>
                    <input type="text" name="nickname" placeholder="your nickname" required id="nickname" class="form-control form-control-lg"  />
                </div>
                <div class="form-group mx-sm-3">
                    <label for="email">email</label>
                    <input type="email" name="email" placeholder="your nickname" required id="email" class="form-control form-control-lg"  />
                </div>
                <div class="form-group mx-sm-3">
                    <label for="password">passw</label>
                    <input type="password" name="password" placeholder="your nickname" required id="password" class="form-control form-control-lg"  />
                </div>`
    }
};



