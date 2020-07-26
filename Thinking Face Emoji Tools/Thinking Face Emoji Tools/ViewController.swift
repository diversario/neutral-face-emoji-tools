//
//  ViewController.swift
//  Thinking Face Emoji Tools
//
//  Created by Ilya Shaisultanov on 7/20/20.
//  Copyright © 2020 Ilya Shaisultanov. All rights reserved.
//

import Cocoa
import SafariServices.SFSafariApplication

class ViewController: NSViewController {

    @IBOutlet var appNameLabel: NSTextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.appNameLabel.stringValue = "📦 Bulk Emoji Upload For Slack";
    }
    
    @IBAction func openSafariExtensionPreferences(_ sender: AnyObject?) {
        SFSafariApplication.showPreferencesForExtension(withIdentifier: "com.diversario.Thinking-Face-Emoji-Tools.Extension") { error in
            if let _ = error {
                // Insert code to inform the user that something went wrong.

            }
        }
    }

}
