<?php
if(isset($_POST['username']) && isset($_POST['password']))
{

	session_start();
	ini_set('session.cookie_lifetime',  0);
	
	$host="localhost";
	$db_username="root";
	$db_password="root"; 
	$db_name="hackmaster"; 
	$projects="projects";

	$username=$_POST['username'];
	$password=$_POST['password'];
	$connection=mysqli_connect("$host", "$db_username","$db_password","$db_name")or die(mysqli_error()); 
   	$usertable="corporatepersonnel";
	$sql2="SELECT * FROM $usertable WHERE username='$username' AND password='$password';";
  	
	$sql2.="SELECT * FROM $projects WHERE name='$username'";
  	$result2=mysqli_multi_query($connection, $sql2);
  	
  	$_SESSION['query']=$result2;
  	// $login=mysqli_use_result($connection);

	if ($login = mysqli_store_result($connection)) {
		
		$count = mysqli_num_rows($login);
  	// $count=mysql_num_rows($result2); 
  	 if($count>=1)
    { 
   	$_SESSION['user']=$username;
   	$b="";
	mysqli_next_result($connection);
   	$result3 = mysqli_store_result($connection);
       while ($row = mysqli_fetch_row($result3)) {
       		foreach( $row as $i)
           { $b.=$i."<br>";}
        }
   		
  	 	 $a=array("resp"=>"Success","projectlist"=>$b);
    		echo json_encode($a);
        }
 
	 else
     {
  	  if($result4=mysqli_query($connection,"SELECT * FROM $usertable WHERE username='$username'"))
{	  $count1=mysqli_num_rows($result4); 
}
else
{
	$count1=0;
}

  	if($count1>=1)
    { 
    	   $a=array("resp"=>"Incorrect password");
   echo json_encode($a);
     }

     else
     {   $a=array("resp"=>"Incorrect username");
   echo json_encode($a);
     }
     }
 
}
}
else
{
	if(!isset($_POST['username']))
	{
		echo "Please enter username";
	}
	else if(!isset($_POST['password']))
	{
		echo "Please enter password";
	}
}
?>