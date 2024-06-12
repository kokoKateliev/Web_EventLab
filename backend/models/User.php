<?php

class User {
    public $id;
    public $username;
    public $firstName;
    public $lastName;
    public $password;
    public $email;
    public $role; 
    public $birthdate;
    public $university; 
    public $faculty; 

    public function __construct($id, $username, $firstName, $lastName, $password, $email, $role, $birthdate, $university, $faculty) {
        $this->id = (int)$id;
        $this->username = $username;
        $this->password = $password;
        $this->email = $email;
        $this->firstName = $firstName;
        $this->lastName = $lastName;
        $this->role = (int)$role;
        $this->birthdate = $birthdate;
        $this->university = (int)$university;
        $this->faculty = (int)$faculty;
    }

    public function checkLogin(): void {
        require_once "../db/DB.php";

        try{
            $db = new DB();
            $connection = $db->getConnection();
        }
        catch(PDOException $e){
            echo json_encode([
                'success' => false,
                'message' => "Неуспешно свързване с базата данни",
            ]);
            exit();
        }

        $selectStatement = $connection->prepare("SELECT username, password FROM `Users` WHERE username = :username");
        $res = $selectStatement->execute(['username' => $this->username]);
        
        $userDB = $selectStatement->fetch();
        if($userDB == false)
        {
            throw new Exception("Невалидно потребителско име!");
        }

        if(!password_verify($this->password, $userDB['password']))
        {
            throw new Exception("Невалидна парола!");
        }
    }

    public function storeInDB(): void {
        require_once "../db/DB.php";

        try{
            $db = new DB();
            $connection = $db->getConnection();
        }
        catch(PDOException $e){
            echo json_encode([
                'success' => false,
                'message' => "Неуспешно свързване с базата данни",
            ]);
        }

        
       
        $insertStatement = $connection->prepare("INSERT INTO `Users` (username, Firstname, Lastname, Password, Email, RoleID, Birthdate, UniversityID, FacultyID)
        VALUES (:username, :Firstname, :Lastname, :Password, :Email, :RoleID, :Birthdate, :UniversityID, :FacultyID)");

        $hashedPass = password_hash($this->password, PASSWORD_DEFAULT);

        $resultIns = $insertStatement->execute([
            'username' => $this->username,
            'Firstname' => $this->firstName,
            'Lastname' => $this->lastName,
            'Password' => $hashedPass,
            'Email' => $this->email,
            'RoleID' => $this->role,
            'Birthdate' => $this->birthdate,
            'UniversityID' => $this->university,
            'FacultyID' => $this->faculty,
        ]);

        if (!$resultIns) {
            $info = $insertStatement->info();
            $message = "";
            
            if ($info[1] == 1062) {
                $message = "Съществува вече такова потребителско име!";
            } else {
                $message = "Грешка при записването на информацията.";
            }
            throw new Exception($message);
        }
    }

    private function requiredFieldsStudent($username, $password, $email, $firstName, $lastName, $role, $birthdate, $university, $faculty): bool {
        return !empty($username) && !empty($password) && !empty($email) && !empty($firstName) && !empty($lastName) && !empty($role) && !empty($birthdate) && !empty($university) && !empty($faculty);
    }

    private function requiredFieldsTeacher($username, $password, $email, $firstName, $lastName, $role, $birthdate, $university): bool {
        return !empty($username) && !empty($password) && !empty($email) && !empty($firstName) && !empty($lastName) && !empty($role) && !empty($birthdate) && !empty($university);
    }

    private function validUsername($username): bool{
        return strlen($username) >= 2 && strlen($username) <= 256 && preg_match('/^[a-zA-Z0-9]+$/', $username);	
	}

    private function validName($name): bool{
        return mb_strlen($name) >= 2 && mb_strlen($name) <= 50 && (
            preg_match('/^[\p{Cyrillic}]+[- \']?[\p{Cyrillic}]+$/u', $name) ||
            preg_match('/^[a-zA-Z]+[- \']?[a-zA-Z]+$/', $name)
        );	
    }

    private function validPassword($password): bool {
        return preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[_\-@!])(?=.*[a-zA-Z].*[a-zA-Z])[a-zA-Z0-9_\-@!]{6,256}$/', $password);	}

    private function validEmail($email): bool {
		return strlen($email) >= 2 && strlen($email) <= 256 && preg_match('/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/', $email);
	}

    private function validBirthdate($dateTime): bool {
        $format = 'Y-m-d';
        $d = DateTime::createFromFormat($format, $dateTime); 
        $currentDate = new DateTime();
        return $d && $d < $currentDate; 
    }

    private function validUniversity($university): bool {
        return $university >= 1 && $university <= 4;
    }

    private function validFaculty($faculty): bool {
        return $faculty >= 1 && $faculty <= 20;
    }

    public function validate(): void {
        if($this->role === 1){
            if(!$this->requiredFieldsStudent($this->username, $this->password, $this->email, $this->firstName, $this->lastName, $this->role, $this->birthdate, $this->university, $this->faculty)){
                throw new Exception("Всички полета са задължителни!");
            }
            else {
                if(!$this->validFaculty($this->faculty)){
                    throw new Exception("Попълнете валиден факултет!");
                }
            }
        }
        elseif ($this->role === 2){
            if(!$this->requiredFieldsTeacher($this->username, $this->password, $this->email, $this->firstName, $this->lastName, $this->role, $this->birthdate, $this->university)){
                throw new Exception("Всички полета са задължителни!");
            }
        }
        else{
            throw new Exception("Попълнете валидна роля!");
        }

        if(!$this->validUsername($this->username)){
            throw new Exception("Попълнете валидно потребителско име!");
        }

        if(!$this->validName($this->firstName)){
            throw new Exception("Попълнете валидно име!");
        }

        if(!$this->validName($this->lastName)){
            throw new Exception("Попълнете валидно фамилия!");
        }

        if(!$this->validPassword($this->password)){
            throw new Exception("Попълнете валидна парола!");
        }

        if(!$this->validEmail($this->email)){
            throw new Exception("Попълнете валиден имейл!");
        }

        if(!$this->validBirthdate($this->birthdate)){
            throw new Exception("Попълнете валидна дата на раждане!");
        }

        if(!$this->validUniversity($this->university)){
            throw new Exception("Попълнете валиден университет!");
        }
    }
}