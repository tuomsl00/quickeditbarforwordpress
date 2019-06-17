
class App extends React.Component {
    
    contentId;

    constructor(props) {
        super(props);
        this.SetEditBar = this.SetEditBar.bind(this);
        this.ShowEditBar = this.ShowEditBar.bind(this);
        this.HideEditBar = this.HideEditBar.bind(this);
        this.toggleEditMode = this.toggleEditMode.bind(this);
        this.togglePreventLinks = this.togglePreventLinks.bind(this);

           this.state = {
               editMode: true,
               regret: 0,
               contentId: 0
           }

    }

    save() {  

        var prefix = this.state.contentId.substring(4);
        var prefixId = prefix.split("_", 1);
        var postId = prefixId[0];
        var ind = document.getElementById(this.state.contentId).getAttribute('name');

        var formData = new FormData();
        formData.append('id', postId);
        if (ind == 'content') {
            formData.append(ind, document.getElementById(this.state.contentId).innerHTML);
        }
        if (ind = "title") {
            formData.append(ind, document.getElementById(this.state.contentId).innerText);
        }
        formData.append('sign', 'Wysiwyg edit bar');
        console.log(formData);
        fetch(saveEdit.homeUrl, {
            method: 'POST',
            body: formData
        })
            .then((res) => {     
                return res.text();
            })
            .then((data) => {
                console.log(data);
            });
     
    }

    SetEditBar(e) {

        if (this.state.contentId != e.target.id && this.state.contentId) {
            document.getElementById(this.state.contentId).removeEventListener("mouseover", this.ShowEditBar);
            document.getElementById(this.state.contentId).removeEventListener("mouseout", this.HideEditBar);
        }

        this.setState({contentId: e.target.id});
        var editTarget = document.getElementById(this.state.contentId);

        var topOffset = (editTarget.getBoundingClientRect().top-document.body.getBoundingClientRect().top);
        document.getElementById("editbar").style.top = (topOffset-20)+"px";
        document.getElementById("editbar").style.left = editTarget.getBoundingClientRect().left+"px";

        
        document.getElementById(e.target.id).addEventListener("mouseover", this.ShowEditBar);
        document.getElementById(e.target.id).addEventListener("mouseout", this.HideEditBar);


        this.ShowEditBar();

    }

    ShowEditBar() {
        clearTimeout(this.state.regret);
        document.getElementById("editbar").style.visibility = "visible";
    }

    HideEditBar() {
        
        if (document.getElementById("editbar").style.visibility == "visible") {
            var regVal = setTimeout(() => {
                document.getElementById("editbar").style.visibility = "hidden"
            }, 1000);
            
            this.setState({regret: regVal});
        }

    }

    togglePreventLinks(event, url) {

        if (this.state.editMode) {
            event.preventDefault();
        } else {
            window.location.href = url;
        }
        
    }

    toggleEditMode() {
        console.log(this.state.editMode);
        this.setState({editMode: !this.state.editMode});
        if (this.state.editMode){
            document.getElementById("wp-admin-bar-editmode").style.backgroundColor = "green";
            document.getElementById("edit-toggle-text").innerText = "Edit mode on";
        } else {
            document.getElementById("wp-admin-bar-editmode").style.backgroundColor = "red";
            document.getElementById("edit-toggle-text").innerText = "Edit mode off";
        }
        let node = document.getElementsByTagName("a");
        for (let i = 0; i < node.length; i++) {
            var noder = document.getElementById(node[i].id == "" ? node[i].id = i: node[i].id);
            console.log(this.state.editMode);
            noder.addEventListener("click", (event) => this.togglePreventLinks(event, node[i].href));

        }
    }

    componentDidMount() {

        let node = document.getElementsByTagName("a");
        for (let i = 0; i < node.length; i++) {
            var noder = document.getElementById(node[i].id == "" ? node[i].id = i: node[i].id);
            console.log(this.state.editMode);
            noder.addEventListener("click", (event) => {
                event.preventDefault();
            });

        }

        document.getElementById("wp-admin-bar-editmode").addEventListener("click", this.toggleEditMode);
        document.getElementById("wp-admin-bar-editmode").style.backgroundColor = "green";
        document.getElementById("edit-toggle-text").innerText = "Edit mode on";

        node = document.getElementsByName("title");
        for (let i = 0; i < node.length; i++) {
            if (node[i].id != "") {
                document.getElementById(node[i].id).addEventListener("click", (e) => this.SetEditBar(e));
            }
              
        }

        node = document.getElementsByName("content");
        for (let i = 0; i < node.length; i++) {
            if (node[i].id != "") {
                document.getElementById(node[i].id).addEventListener("click", (e) => this.SetEditBar(e));
            }
              
        }
        document.getElementById("editbar").addEventListener("mouseover", this.ShowEditBar);
        document.getElementById("editbar").addEventListener("mouseout", this.HideEditBar);
    }

    render() {



    
        let btn = new EditAction();
        
        return (
            <p className="editBarRegion">
            <button onClick={() => this.save()}>Save</button>
            <button onClick={() => btn.setStyle("bold")}>B</button>
            <button onClick={() => btn.setStyle("italic")}>I</button>
            <button onClick={() => btn.setStyle("underline")}>I</button>
            </p>
        );
    }
};

ReactDOM.render(<App />, document.getElementById("editbar"));

