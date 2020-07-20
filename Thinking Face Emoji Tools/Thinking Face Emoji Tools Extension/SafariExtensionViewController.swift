//
//  SafariExtensionViewController.swift
//  Thinking Face Emoji Tools Extension
//
//  Created by Ilya Shaisultanov on 7/20/20.
//  Copyright © 2020 Ilya Shaisultanov. All rights reserved.
//

import SafariServices

class SafariExtensionViewController: SFSafariExtensionViewController {
    
    static let shared: SafariExtensionViewController = {
        let shared = SafariExtensionViewController()
        shared.preferredContentSize = NSSize(width:320, height:240)
        return shared
    }()

}
