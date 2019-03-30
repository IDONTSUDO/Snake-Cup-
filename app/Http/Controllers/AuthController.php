<?php

namespace Horsefly\Http\Controllers;

use Horsefly\User;
use Redirect;
use Illuminate\Http\Request;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Validator, DB, Hash, Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Mail\Message;

class AuthController extends Controller
{
    /**
     * Register new user
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        /*
         * Validate user's data
         */
        $credentials = $request->only('name', 'email', 'password');

        $rules = [
            'name' => 'required|min:3|max:255|',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|min:6|max:255',
        ];

        $validator = Validator::make($credentials, $rules);
        if ($validator->fails()) {
            return response()->json(['success' => false, 'error' => $validator->messages()]);
        }

        /*
         * Add user to database
         */
        $name = $request->name;
        $email = $request->email;
        $password = $request->password;

        $user = User::create(['name' => $name, 'email' => $email, 'password' => Hash::make($password)]);

        /*
         * Create verification code
         */
        $verification_code = str_random(30); //Generate verification code

        DB::table('user_verifications')->insert(['user_id' => $user->id, 'token' => $verification_code]);

        $subject = "Please verify your email address.";

        /*
         * Send verification link to user's email
         */
        Mail::send('email.verify', ['name' => $name, 'verification_code' => $verification_code],
            function ($mail) use ($email, $name, $subject) {
                $mail->from(getenv('FROM_EMAIL_ADDRESS'), "snakecup@snakecup.com");
                $mail->to($email, $name);
                $mail->subject($subject);
            });

        return response()->json(['success' => true, 'message' => 'Thanks for signing up! Please check your email to complete your registration.']);
    }

    /**
     * Login user
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        /*
         * Validate data
         */
        $credentials = $request->only('email', 'password');

        $rules = [
            'email' => 'required|email',
            'password' => 'required',
        ];

        $validator = Validator::make($credentials, $rules);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'error' => $validator->messages()], 401);
        }

        $credentials['is_verified'] = 1;//check if user verified

        try {
            // attempt to verify the credentials and create a token for the user
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['success' => false, 'error' => 'We cant find an account with this credentials. Please make sure you entered the right information and you have verified your email address.'], 404);
            }
        } catch (JWTException $e) {
            // something went wrong whilst attempting to encode the token
            return response()->json(['success' => false, 'error' => 'Failed to login, please try again.'], 500);
        }
        // all good so return the token
        return $this->respondWithToken($token);
    }

    /**
     * User Verification
     *
     * @param $verification_code
     * @return \Illuminate\Http\JsonResponse
     */
    public function verifyUser($verification_code)
    {
        $response = [
            'success' => false,
            'error' => "Verification code is invalid."
        ];

        $check = DB::table('user_verifications')->where('token', $verification_code)->first();
        if (!is_null($check)) {
            $user = User::find($check->user_id);
            //Check if user already verified
            if ($user->is_verified == 1) {
                $response = [
                    'success' => true,
                    'message' => 'Account already verified..'
                ];
            }

            //Verify user if not verified
            if(!$response['success']){            
                $user->update(['is_verified' => 1]);
                DB::table('user_verifications')->where('token', $verification_code)->delete();
                $response = [
                    'success' => true,
                    'message' => 'You have successfully verified your email address.'
                ];
            }
        }
        //TODO: Deside what to do after verification...
        $getParams = http_build_query($response);
        
        return Redirect::to('http://snakecup.com?'.$getParams);
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'success' => true,
            'data' => [
                'token' => $token,
                'token_type' => 'bearer',
                'expires_in' => auth()->factory()->getTTL() * 60
            ]
        ]);
    }
}
