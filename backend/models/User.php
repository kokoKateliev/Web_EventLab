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

    public function __construct($id, $username, $password, $email, $firstName, $lastName, $role, $birthdate, $university, $faculty) {
        $this->id = $id;
        $this->username = $username;
        $this->password = $password;
        $this->email = $email;
        $this->firstName = $firstName;
        $this->lastName = $lastName;
        $this->role = $role;
        $this->birthdate = $birthdate;
        $this->university = $university;
        $this->faculty = $faculty;
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

        $selectStatement = $connection->prepare("SELECT * FROM `Users` WHERE username = :username");
        $res = $selectStatement->execute(['username' => $this->username]);
        
        $userDB = $selectStatement->fetch();
        if(!$userDB == false)
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
            'Password' => $this->hashedPass,
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
        return !empty($username) && !empty($password) && !empty() && !empty(email) && !empty(firstName) && !empty(lastName) && !empty(role) && !empty(birthdate) && !empty(university) && !empty(faculty);
    }

    private function requiredFieldsTeacher($username, $password, $email, $firstName, $lastName, $role, $birthdate, $university): bool {
        return !empty($username) && !empty($password) && !empty() && !empty(email) && !empty(firstName) && !empty(lastName) && !empty(role) && !empty(birthdate) && !empty(university);
    }

    private function validUsername($username): bool{
        return strlen($username) >= 2 && strlen($username) <= 256 && preg_match('/^[a-zA-Z0-9]+$/', $username);	
	}

    private function validName($name): bool{
		return strlen($name) >= 2 && strlen($name) <= 50 && (preg_match('/^[\p{Cyrillic}]+[- \']?[\p{Cyrillic}]+$/u', $field) || preg_match('/^[a-zA-Z]+[- \']?[a-zA-Z]+$/', $name));	
	}

    //regex to be changed
    private function validPassword($password): bool {
		return preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{6,30}$/', $password);
	}

    private function validEmail($email): bool {
		return strlen($email) >= 2 && strlen($email) <= 256 && preg_match('/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/', $email);
	}

    private function validRole($role): bool { 
		return $role === "1" || $role === "2";
	}

    private function validBirthdate($date): bool {
        $format = 'd-m-Y';
        $d = DateTime::createFromFormat($format, $date); 
        $year = (int)$d->format('Y');
        $month = (int)$d->format('m');
        $date = (int)$d->format('d');
        return $d && $d->format($format) === $date && $year <= 2024 && $month <= 6 && $date <= 07; 
    }

    private function validUniversity($university): bool {
        return is_int($university) && $university >= "1" && $university <= "4";
    }

    private function validFaculty($faculty): bool {
        return is_int($faculty) && $faculty >= "1" && $faculty <= "20";
    }

    // to be added
    public function validate(): void {
        
    }
}


